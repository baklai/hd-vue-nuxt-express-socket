<template>
  <v-container fill-height fluid class="pa-0" v-resize="onResize">
    <ModalsDelete ref="delete" @closeEvent="getItems" v-if="$hasScope('api:channel:remove:one')" />
    <ModalsChannel
      ref="channel"
      @closeEvent="getItems"
      v-if="$hasScope('api:channel:remove:one')"
    />
    <v-data-table
      dense
      item-key="id"
      fixed-header
      :items="items"
      :headers="headers"
      :loading="loading"
      :search="filters.search"
      :items-per-page.sync="filters.perpage"
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
          <v-responsive width="210" class="mr-2">
            <CustomFilterInput v-model="filters.search" :label="$t('Search in table')" />
          </v-responsive>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="cleanFilters()" class="mx-2">
                <v-icon> mdi-filter-remove-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Clear filters') }} </span>
          </v-tooltip>
          <v-tooltip bottom v-if="$hasScope('api:channel:create:one')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="onItem(null)" class="mx-2">
                <v-icon> mdi-plus-circle-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Create record') }} </span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon class="mx-2" v-on="on" v-bind="attrs" @click="getItems">
                <v-icon> mdi-cached </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Update records') }} </span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon class="mx-2" v-on="on" v-bind="attrs">
                <v-icon v-on="on" v-bind="attrs"> mdi-cog-outline </v-icon>
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
            <v-list-item @click="onItem(null)" v-if="$hasScope('api:channel:create:one')">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-plus-circle-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Create record') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu top offset-y v-if="$hasScope('app:channel:export:table')">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text outlined v-bind="attrs" v-on="on" class="ml-2">
              <v-icon small left> mdi-file-chart-outline </v-icon>
              {{ $t('Reports') }}
              <v-icon small right> mdi-chevron-up </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item
              v-if="$hasScope('app:channel:export:table')"
              @click="
                $store.dispatch('exportCSV', {
                  delimiter: ';',
                  fileName: 'channels'
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

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item @click="onItem(item.id)" v-if="$hasScope('api:channel:update:one')">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-note-edit-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Edit record') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onItemDel(item.id)" v-if="$hasScope('api:channel:remove:one')">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-trash-can-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Delete record') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-system-bar>
            <v-spacer />
            <strong> {{ item.locationFrom }} - {{ item.locationTo }} </strong>
            <v-spacer />
          </v-system-bar>
        </v-menu>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-swap-horizontal',
    apptitle: 'Network channels',
    appsubtitle: 'Network channels of the technical support department'
  },

  data() {
    return {
      windowSize: { x: 0, y: 0 },
      dialog: false,
      loading: false,
      items: [],

      filters: {
        perpage: 15,
        search: ''
      }
    };
  },

  watch: {
    filters: {
      handler(value) {
        localStorage.setItem(`${this.$route.name}.filters`, JSON.stringify(value));
      },
      deep: true
    }
  },

  async mounted() {
    this.filters = localStorage[`${this.$route.name}.filters`]
      ? JSON.parse(localStorage.getItem(`${this.$route.name}.filters`))
      : this.filters;
    await this.getItems();
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
          text: this.$t('Location start'),
          value: 'locationFrom',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Unit start'),
          value: 'unitFrom',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Location end'),
          value: 'locationTo',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Unit end'),
          value: 'unitTo',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Level'),
          value: 'level',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Type'),
          value: 'type',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Speed'),
          value: 'speed',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Status'),
          value: 'status',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Operator'),
          value: 'operator',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },

        {
          text: this.$t('Composition'),
          value: 'composition',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        }
      ];
    }
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },

    async getItems() {
      try {
        this.loading = true;
        this.items = await this.$store.dispatch('api/channel/findAll');
        this.$toast.success(this.$t('The list of records has been updated'));
      } catch (err) {
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    onItem(id) {
      if (this.$hasScope('api:channel:find:one')) {
        this.$refs.channel.onItem(id);
      }
    },

    onItemDel(id) {
      if (this.$hasScope('api:channel:remove:one')) {
        this.$refs.delete.onConfirm(id, 'channel');
      }
    },

    cleanFilters() {
      this.filters.perpage = 15;
      this.filters.search = '';
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

.table-fixed-col :deep(thead > tr > th:nth-child(1)) {
  z-index: 3 !important;
}

.table-fixed-col :deep(tbody > tr:hover > td:nth-child(1)) {
  background: var(--v-thover-base) !important;
}

.table-fixed-col :deep(tbody > tr:hover) {
  background: var(--v-thover-base) !important;
}
</style>
