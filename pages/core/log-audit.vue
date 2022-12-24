<template>
  <v-container fill-height fluid class="pa-0" v-resize="onResize">
    <v-data-table
      dense
      item-key="id"
      fixed-header
      :items="items"
      :headers="headers"
      :loading="loading"
      :options.sync="options"
      :server-items-length="total"
      :footer-props="{
        itemsPerPageOptions: [10, 15, 20, 25, -1],
        itemsPerPageText: $t('Rows per page'),
        showFirstLastPage: true,
        showCurrentPage: true
      }"
      :height="windowSize.y - 64 - 64 - 59"
      :loading-text="$t('Loading please wait')"
      :no-data-text="$t('No matching records found')"
      class="table-fixed-col"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-icon large left> {{ apppage.appicon }} </v-icon>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(apppage.apptitle) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t(apppage.appsubtitle) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-spacer />
          <v-responsive width="260" class="mr-2">
            <CustomFilterInput v-model="filters.log" :label="$t('Search in log')" />
          </v-responsive>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="cleanFilters()" class="mx-2">
                <v-icon> mdi-filter-remove-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Clear filters') }} </span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="getItems" class="mx-2">
                <v-icon> mdi-cached </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Update records') }} </span>
          </v-tooltip>
          <v-tooltip bottom v-if="$hasScope('logger:remove:all')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="deleteItems()" class="mx-2">
                <v-icon> mdi-trash-can-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Delete all records') }} </span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" class="mx-2">
                <v-icon> mdi-cog-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Options') }} </span>
          </v-tooltip>
        </v-toolbar>
      </template>

      <template v-slot:no-data>
        <CustomClearFilter :filters="filters" />
      </template>

      <template v-slot:[`footer.prepend`]>
        <v-menu top offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text outlined v-bind="attrs" v-on="on">
              <v-icon small left> mdi-tune </v-icon>
              {{ $t('Actions') }}
              <v-icon small right> mdi-chevron-up </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item @click="getItems">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-cached </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Update records') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="cleanFilters()">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-filter-remove-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Clear filters') }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="deleteItems()" v-if="$hasScope('logger:remove:all')">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-trash-can-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Delete all records') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu top offset-y v-if="$hasScope('logger:export:table')">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text outlined v-bind="attrs" v-on="on" class="ml-2">
              <v-icon small left> mdi-file-chart-outline </v-icon>
              {{ $t('Reports') }}
              <v-icon small right> mdi-chevron-up </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item
              v-if="$hasScope('logger:export:table')"
              @click="
                $store.dispatch('exportCSV', {
                  delimiter: ';',
                  fileName: 'logger'
                })
              "
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-content-save-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Export records') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:[`header.actions`]="{ header }">
        {{ header.text }}
        <v-icon small> mdi-cog-outline </v-icon>
      </template>

      <template v-slot:[`header.address`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.address" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.user`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.user" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.event`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.event" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.datetime`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.datetime" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item @click="getItems()" v-if="$hasScope('logger:find:all')">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-cached </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Update records') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteItems()" v-if="$hasScope('logger:remove:all')">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-trash-can-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Delete all records') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-system-bar>
            <v-spacer />
            <strong> {{ item.date | dateTimeToStr }} </strong>
            <v-spacer />
          </v-system-bar>
        </v-menu>
      </template>

      <template v-slot:[`item.address`]="{ item }">
        <v-chip label small>
          {{ item.address }}
        </v-chip>
      </template>

      <template v-slot:[`item.user`]="{ item }">
        <v-chip label small>
          {{ item.user }}
        </v-chip>
      </template>

      <template v-slot:[`item.event`]="{ item }">
        <v-chip label outlined small>
          {{ item.event | eventToStr }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-math-log',
    apptitle: 'Activity audit',
    appsubtitle: 'Audit log of the helpdesk service'
  },

  data() {
    return {
      windowSize: { x: 0, y: 0 },
      loading: false,
      items: [],
      total: 0,
      options: {},
      filters: {
        address: '',
        user: '',
        event: '',
        datetime: ''
      }
    };
  },

  watch: {
    filters: {
      handler(value) {
        localStorage.setItem(`${this.$route.name}.filters`, JSON.stringify(value));
        this.options.page = 1;
        this.getItems();
      },
      deep: true
    },

    options: {
      handler(value) {
        localStorage.setItem(`${this.$route.name}.options`, JSON.stringify(value));
        this.getItems();
      },
      deep: true
    }
  },

  async mounted() {
    this.filters = localStorage[`${this.$route.name}.filters`]
      ? JSON.parse(localStorage.getItem(`${this.$route.name}.filters`))
      : this.filters;
    this.options = localStorage[`${this.$route.name}.options`]
      ? JSON.parse(localStorage.getItem(`${this.$route.name}.options`))
      : this.options;
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    },

    headers() {
      return [
        {
          text: '',
          value: 'actions',
          align: 'center',
          width: '32px',
          filterable: false,
          sortable: false
        },
        {
          text: this.$t('Address'),
          value: 'address',
          align: 'start',
          width: '120px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('User'),
          value: 'user',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Event'),
          value: 'event',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Date'),
          value: 'datetime',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('User-agent'),
          value: 'agent',
          align: 'start',
          width: '400px',
          filterable: false,
          sortable: false
        }
      ];
    }
  },

  filters: {
    dateTimeToStr: function (value) {
      return value ? new Date(value).toLocaleString() : '-';
    },

    eventToStr: function (value) {
      const [model, ...args] = value.split(':');
      if (value.includes('find')) return `READ ${model.toUpperCase()} [ ${value} ]`;
      else if (value.includes('create')) return `CREATE ${model.toUpperCase()} [ ${value} ]`;
      else if (value.includes('update')) return `UPDATE ${model.toUpperCase()} [ ${value} ]`;
      else if (value.includes('remove')) return `DELETE ${model.toUpperCase()} [ ${value} ]`;
      else return `GET ${model.toUpperCase()} [ ${value} ]`;
    }
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },

    async getItems() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch('api/logger/findAll', {
          options: this.options,
          filters: this.filters
        });
        this.items = data.docs;
        this.total = data.total;
        this.$toast.success(this.$t('The list of records has been updated'));
      } catch (err) {
        this.items = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    async deleteItems() {
      if (this.$hasScope('logger:remove:all')) {
        try {
          await this.$store.dispatch('api/logger/removeAll');
          this.$toast.success(this.$t('The list of records has been removed'));
        } catch (err) {
          this.$toast.error(err.message);
        } finally {
          await this.getItems();
        }
      }
    },

    cleanFilters() {
      this.options.page = 1;
      this.options.itemsPerPage = 15;
      this.filters.address = '';
      this.filters.user = '';
      this.filters.event = '';
      this.filters.datetime = '';
    }
  }
};
</script>

<style scoped>
.table-fixed-col :deep(thead > tr > th:nth-child(1)),
.table-fixed-col :deep(tbody > tr > td:nth-child(1)) {
  left: 0 !important;
  position: sticky !important;
  z-index: inherit !important;
  background: var(--v-background-base) !important;
}

.table-fixed-col :deep(thead > tr > th:nth-child(2)),
.table-fixed-col :deep(tbody > tr > td:nth-child(2)) {
  left: 44px !important;
  position: sticky !important;
  z-index: inherit !important;
  background: var(--v-background-base) !important;
}

.table-fixed-col :deep(thead > tr > th:nth-child(1)),
.table-fixed-col :deep(thead > tr > th:nth-child(2)) {
  z-index: 3 !important;
}

.table-fixed-col :deep(tbody > tr:hover > td:nth-child(1)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(2)) {
  background: var(--v-thover-base) !important;
}

.table-fixed-col :deep(tbody > tr:hover) {
  background: var(--v-thover-base) !important;
}
</style>
