<template>
  <v-container fill-height fluid class="pa-0" v-resize="onResize">
    <ModalsDelete ref="delete" @closeEvent="getItems" v-if="$auth.user.isAdmin" />
    <ModalsUser ref="user" @closeEvent="getItems" v-if="$auth.user.isAdmin" />
    <v-data-table
      dense
      item-key="id"
      fixed-header
      :items="items"
      :headers="headers"
      :loading="loading"
      :items-per-page.sync="filters.perpage"
      :footer-props="{
        itemsPerPageOptions: [10, 15, 20, 25, 50, -1],
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
            <CustomFilterInput v-model="filters.name" :label="$t('Search fullname')" />
          </v-responsive>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" class="mx-2" @click="cleanFilters()">
                <v-icon> mdi-filter-remove-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Clear filters') }} </span>
          </v-tooltip>
          <v-tooltip bottom v-if="$auth.user.isAdmin">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click.stop="onItem(null)" class="mx-2">
                <v-icon> mdi-plus-circle-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Create account') }} </span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="getItems" class="mx-2">
                <v-icon> mdi-cached </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Update records') }} </span>
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
            <v-list-item @click.stop="onItem(null)" v-if="$auth.user.isAdmin">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-plus-circle-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Create account') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu top offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text outlined v-bind="attrs" v-on="on" class="ml-2">
              <v-icon small left> mdi-file-chart-outline </v-icon>
              {{ $t('Reports') }}
              <v-icon small right> mdi-chevron-up </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item
              v-if="$auth.user.isAdmin"
              @click="
                $store.dispatch('exportCSV', {
                  delimiter: ';',
                  fileName: 'users'
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

      <template v-slot:[`header.email`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.email" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.login`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.login" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.isActive`]="{ header }">
        {{ header.text }}
        <CustomFilterSwitch v-model="filters.isActive" :label="$t('Show only user activated')" />
      </template>

      <template v-slot:[`header.isAdmin`]="{ header }">
        {{ header.text }}
        <CustomFilterSwitch v-model="filters.isAdmin" :label="$t('Show only user admin')" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item @click="onItem(item.id)" v-if="$auth.user.isAdmin">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-eye-circle-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('View record') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onItem(null)" v-if="$auth.user.isAdmin">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-plus-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title> {{ $t('Create record') }} </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onItem(item.id)" v-if="$auth.user.isAdmin">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-pencil-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title> {{ $t('Edit record') }} </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onItemDel(item.id)" v-if="$auth.user.isAdmin">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-trash-can-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title> {{ $t('Delete record') }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <v-icon small left> mdi-account-circle-outline </v-icon>
        <span> {{ item.name }} </span>
      </template>

      <template v-slot:[`item.email`]="{ item }">
        <span> {{ item.email }} </span>
      </template>

      <template v-slot:[`item.login`]="{ item }">
        <v-icon small left> mdi-account-outline </v-icon>
        <span> {{ item.login }} </span>
      </template>

      <template v-slot:[`item.isActive`]="{ item }">
        <v-icon small :color="item.isActive ? 'success' : 'default'">
          {{ item.isActive ? 'mdi-check-bold' : 'mdi-minus' }}
        </v-icon>
      </template>

      <template v-slot:[`item.isAdmin`]="{ item }">
        <v-icon small :color="item.isAdmin ? 'success' : 'default'">
          {{ item.isAdmin ? 'mdi-check-bold' : 'mdi-minus' }}
        </v-icon>
      </template>

      <template v-slot:[`item.scope`]="{ item }">
        <v-chip x-small outlined :color="item.scope.length ? 'success' : 'default'">
          <span> {{ item.scope.length }} / {{ $helpdesk.scopes.length }} </span>
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-account-supervisor-outline',
    apptitle: 'User accounts',
    appsubtitle: 'User accounts of the helpdesk service'
  },

  data() {
    return {
      windowSize: { x: 0, y: 0 },
      loading: false,
      items: [],

      filters: {
        perpage: 15,
        name: '',
        login: '',
        email: '',
        isActive: '',
        isAdmin: ''
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
          text: this.$t('Name'),
          value: 'name',
          align: 'start',
          width: '180px',
          sortable: true,
          filter: (value) => {
            if (!this.filters.name) return true;
            if (value) return value.toUpperCase().includes(this.filters.name.toUpperCase());
          }
        },
        {
          text: this.$t('Login'),
          value: 'login',
          align: 'start',
          width: '150px',
          sortable: true,
          filter: (value) => {
            if (!this.filters.login) return true;
            if (value) return value.toUpperCase().includes(this.filters.login.toUpperCase());
          }
        },
        {
          text: this.$t('E-mail'),
          value: 'email',
          align: 'start',
          width: '200px',
          sortable: true,
          filter: (value) => {
            if (!this.filters.email) return true;
            if (value) return value.toUpperCase().includes(this.filters.email.toUpperCase());
          }
        },
        {
          text: this.$t('Phone'),
          value: 'phone',
          align: 'start',
          width: '200px',
          sortable: false,
          filterable: false
        },
        {
          text: this.$t('Active'),
          value: 'isActive',
          align: 'start',
          width: '150px',
          sortable: true,
          filter: (value) => {
            if (!this.filters.isActive) return true;
            return value.toString() === this.filters.isActive.toString();
          }
        },
        {
          text: this.$t('Admin'),
          value: 'isAdmin',
          align: 'start',
          width: '150px',
          sortable: true,
          filter: (value) => {
            if (!this.filters.isAdmin) return true;
            return value.toString() === this.filters.isAdmin.toString();
          }
        },
        {
          text: this.$t('Scope'),
          value: 'scope',
          align: 'start',
          width: '150px',
          sortable: false,
          filterable: false
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
        this.items = await this.$store.dispatch('api/user/findAll');
        this.$toast.success(this.$t('The list of records has been updated'));
      } catch (err) {
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    onItem(id) {
      if (this.$auth.user.isAdmin) {
        this.$refs.user.onItem(id);
      }
    },

    onItemDel(id) {
      if (this.$auth.user.isAdmin) {
        this.$refs.delete.onConfirm(id, 'user');
      }
    },

    cleanFilters() {
      this.filters.perpage = 15;
      this.filters.name = '';
      this.filters.login = '';
      this.filters.email = '';
      this.filters.isActive = '';
      this.filters.isAdmin = '';
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

.table-fixed-col :deep(thead > tr > th:nth-child(3)),
.table-fixed-col :deep(tbody > tr > td:nth-child(3)) {
  left: 194px !important;
  position: sticky !important;
  z-index: inherit !important;
  background: var(--v-background-base) !important;
}

.table-fixed-col :deep(thead > tr > th:nth-child(1)),
.table-fixed-col :deep(thead > tr > th:nth-child(2)),
.table-fixed-col :deep(thead > tr > th:nth-child(3)) {
  z-index: 3 !important;
}

.table-fixed-col :deep(tbody > tr:hover > td:nth-child(1)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(2)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(3)) {
  background: var(--v-thover-base) !important;
}

.table-fixed-col :deep(tbody > tr:hover) {
  background: var(--v-thover-base) !important;
}
</style>
