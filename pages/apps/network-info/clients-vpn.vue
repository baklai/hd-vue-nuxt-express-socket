<template>
  <v-container fill-height fluid class="pa-0" v-resize="onResize">
    <ModalsDelete ref="delete" @closeEvent="getItems" v-if="$hasScope('vpn:remove:one')" />
    <ModalsVPN ref="vpn" @closeEvent="getItems" v-if="$hasScope('vpn:find:one')" />
    <v-data-table
      dense
      fixed-header
      item-key="id"
      :items="items"
      :headers="headers"
      :loading="loading"
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
          <v-responsive width="240" class="mr-2">
            <CustomFilterInput v-model="filters.vpn" :label="$t('Search VPN Address')" />
          </v-responsive>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="cleanFilters()" class="mx-2">
                <v-icon> mdi-filter-remove-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Clear filters') }} </span>
          </v-tooltip>
          <v-tooltip bottom v-if="$hasScope('vpn:create:one')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" class="mx-2" @click="onItem(null)">
                <v-icon> mdi-plus-circle-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Create record') }} </span>
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
          </v-list>
        </v-menu>
        <v-menu top offset-y v-if="$hasScope('vpn:export:table')">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text outlined v-bind="attrs" v-on="on" class="ml-2">
              <v-icon small left> mdi-file-chart-outline </v-icon>
              {{ $t('Reports') }}
              <v-icon small right> mdi-chevron-up </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item
              @click="
                $store.dispatch('exportCSV', {
                  delimiter: ';',
                  fileName: 'vpntable'
                })
              "
              v-if="$hasScope('vpn:export:table')"
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

      <template v-slot:[`header.ipaddress`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.ipaddress" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.login`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.login" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.location`]="{ header }">
        {{ header.text }}
        <CustomFilterSelect
          v-model="filters.location"
          :items="locations"
          :itemValue="'id'"
          :itemText="'title'"
          :label="$t('Search in column')"
        />
      </template>

      <template v-slot:[`header.unit`]="{ header }">
        {{ header.text }}
        <CustomFilterSelect
          v-model="filters.unit"
          :items="units"
          :itemValue="'id'"
          :itemText="'title'"
          :label="$t('Search in column')"
        />
      </template>

      <template v-slot:[`header.company`]="{ header }">
        {{ header.text }}
        <CustomFilterSelect
          v-model="filters.company"
          :items="companies"
          :itemValue="'id'"
          :itemText="'title'"
          :label="$t('Search in column')"
        />
      </template>

      <template v-slot:[`header.branch`]="{ header }">
        {{ header.text }}
        <CustomFilterSelect
          v-model="filters.branch"
          :items="branches"
          :itemValue="'id'"
          :itemText="'title'"
          :label="$t('Search in column')"
        />
      </template>

      <template v-slot:[`header.enterprise`]="{ header }">
        {{ header.text }}
        <CustomFilterSelect
          v-model="filters.enterprise"
          :items="enterprises"
          :itemValue="'id'"
          :itemText="'title'"
          :label="$t('Search in column')"
        />
      </template>

      <template v-slot:[`header.department`]="{ header }">
        {{ header.text }}
        <CustomFilterSelect
          v-model="filters.department"
          :items="departments"
          :itemValue="'id'"
          :itemText="'title'"
          :label="$t('Search in column')"
        />
      </template>

      <template v-slot:[`header.fullname`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.fullname" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.phone`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.phone" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.mail`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.mail" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.service`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.service" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <HostDefActions v-if="item.ipaddress" :host="item.ipaddress" />
            <v-divider v-if="item.ipaddress" />
            <v-list-item @click="onItem(item.id)" v-if="$hasScope('vpn:update:one')">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-note-edit-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Edit record') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="$hasScope('vpn:remove:one')" @click="onItemDel(item.id)">
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
            <strong> VPN {{ item.vpn }} </strong>
            <v-spacer />
          </v-system-bar>
        </v-menu>
      </template>

      <template v-slot:[`item.vpn`]="{ item }">
        <span class="cursor-color-bold" @click="onDrawer(item.id)">
          {{ item.vpn }}
        </span>
      </template>

      <template v-slot:[`item.ipaddress`]="{ item }">
        <span class="cursor-bold" @click="onDrawer(item.id)">
          {{ item.ipaddress ? item.ipaddress : '-' }}
        </span>
      </template>

      <template v-slot:[`item.location`]="{ item }">
        {{ item.location ? item.location.title : '-' }}
      </template>

      <template v-slot:[`item.unit`]="{ item }">
        {{ item.unit ? item.unit.title : '-' }}
      </template>

      <template v-slot:[`item.company`]="{ item }">
        {{ item.company ? item.company.title : '-' }}
      </template>

      <template v-slot:[`item.branch`]="{ item }">
        {{ item.branch ? item.branch.title : '-' }}
      </template>

      <template v-slot:[`item.enterprise`]="{ item }">
        {{ item.enterprise ? item.enterprise.title : '-' }}
      </template>

      <template v-slot:[`item.department`]="{ item }">
        {{ item.department ? item.department.title : '-' }}
      </template>

      <template v-slot:[`item.position`]="{ item }">
        {{ item.position ? item.position.title : '-' }}
      </template>

      <template v-slot:[`item.dateOpen`]="{ item }">
        {{ item.dateOpen | dateToStr }}
      </template>

      <template v-slot:[`item.dateClose`]="{ item }">
        {{ item.dateClose | dateToStr }}
      </template>
    </v-data-table>
    <ReportsDrawerVPNClient ref="drawer" v-if="$hasScope('vpn:find:one')" />
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-security-network',
    apptitle: 'VPN IP Address',
    appsubtitle: 'VPN IP Address of the technical support department'
  },

  async asyncData({ store }) {
    const locations = await store.dispatch('api/location/findAll');
    const units = await store.dispatch('api/unit/findAll');
    const companies = await store.dispatch('api/company/findAll');
    const branches = await store.dispatch('api/branch/findAll');
    const enterprises = await store.dispatch('api/enterprise/findAll');
    const departments = await store.dispatch('api/department/findAll');
    const positions = await store.dispatch('api/position/findAll');
    return {
      companies,
      branches,
      enterprises,
      departments,
      positions,
      locations,
      units
    };
  },

  data() {
    return {
      windowSize: { x: 0, y: 0 },
      dialog: false,
      loading: false,
      items: [],

      filters: {
        perpage: 15,
        vpn: '',
        ipaddress: '',
        login: '',
        location: '',
        unit: '',
        company: '',
        branch: '',
        enterprise: '',
        department: '',
        position: '',
        fullname: '',
        phone: '',
        mail: '',
        service: ''
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
          text: this.$t('VPN Address'),
          value: 'vpn',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.vpn) return true;
            if (value) return value.toLowerCase().includes(this.filters.vpn.toLowerCase());
          }
        },

        {
          text: this.$t('User login'),
          value: 'login',
          align: 'start',
          filterable: true,
          sortable: true,
          width: '200px',
          filter: (value) => {
            if (!this.filters.login) return true;
            if (value) return value.toLowerCase().includes(this.filters.login.toLowerCase());
          }
        },

        {
          text: this.$t('IP Address'),
          value: 'ipaddress',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.ipaddress) return true;
            if (value) return value.toLowerCase().includes(this.filters.ipaddress.toLowerCase());
          }
        },

        {
          text: this.$t('Location'),
          value: 'location',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.location) return true;
            if (value)
              return value.title.toLowerCase().includes(this.filters.location.toLowerCase());
          }
        },
        {
          text: this.$t('Unit'),
          value: 'unit',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.unit) return true;
            if (value) return value.title.toLowerCase().includes(this.filters.unit.toLowerCase());
          }
        },
        {
          text: this.$t('Company'),
          value: 'company',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.company) return true;
            if (value)
              return value.title.toLowerCase().includes(this.filters.company.toLowerCase());
          }
        },
        {
          text: this.$t('Branch'),
          value: 'branch',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.branch) return true;
            if (value) return value.title.toLowerCase().includes(this.filters.branch.toLowerCase());
          }
        },
        {
          text: this.$t('Enterprise'),
          value: 'enterprise',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.enterprise) return true;
            if (value)
              return value.title.toLowerCase().includes(this.filters.enterprise.toLowerCase());
          }
        },
        {
          text: this.$t('Department'),
          value: 'department',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.department) return true;
            if (value)
              return value.title.toLowerCase().includes(this.filters.department.toLowerCase());
          }
        },

        {
          text: this.$t('Position'),
          value: 'position',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.position) return true;
            if (value)
              return value.title.toLowerCase().includes(this.filters.position.toLowerCase());
          }
        },

        {
          text: this.$t('Fullname'),
          value: 'fullname',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.fullname) return true;
            if (value) return value.toLowerCase().includes(this.filters.fullname.toLowerCase());
          }
        },
        {
          text: this.$t('Phone'),
          value: 'phone',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: false,
          filter: (value) => {
            if (!this.filters.phone) return true;
            if (value) return value.toLowerCase().includes(this.filters.phone.toLowerCase());
          }
        },
        {
          text: this.$t('Mail'),
          value: 'mail',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.mail) return true;
            if (value) return value.toLowerCase().includes(this.filters.mail.toLowerCase());
          }
        },
        {
          text: this.$t('Date open'),
          value: 'dateOpen',
          align: 'start',
          width: '200px',
          filterable: false,
          sortable: false
        },
        {
          text: this.$t('Date close'),
          value: 'dateClose',
          align: 'start',
          width: '200px',
          filterable: false,
          sortable: false
        },
        {
          text: this.$t('Service'),
          value: 'service',
          align: 'start',
          width: '250px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.service) return true;
            if (value) return value.toLowerCase().includes(this.filters.service.toLowerCase());
          }
        },
        {
          text: this.$t('Comment'),
          value: 'comment',
          align: 'start',
          width: '600px',
          filterable: false,
          sortable: false
        }
      ];
    }
  },

  filters: {
    dateToStr: function (value) {
      return value ? new Date(value).toLocaleDateString() : '-';
    }
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },

    async getItems() {
      try {
        this.loading = true;
        this.items = await this.$store.dispatch('api/vpn/findAll');
        this.$toast.success(this.$t('The list of records has been updated'));
      } catch (err) {
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    onItem(id) {
      if (this.$hasScope('vpn:find:one')) {
        this.$refs.vpn.onItem(id);
      }
    },

    onItemDel(id) {
      if (this.$hasScope('vpn:remove:one')) {
        this.$refs.delete.onConfirm(id, 'vpn');
      }
    },

    onDrawer(id) {
      if (this.$hasScope('vpn:find:one')) {
        this.$refs.drawer.onItem(id);
      }
    },

    cleanFilters() {
      this.filters.perpage = 15;
      this.filters.vpn = '';
      this.filters.ipaddress = '';
      this.filters.login = '';
      this.filters.location = '';
      this.filters.unit = '';
      this.filters.company = '';
      this.filters.branch = '';
      this.filters.enterprise = '';
      this.filters.department = '';
      this.filters.position = '';
      this.filters.fullname = '';
      this.filters.phone = '';
      this.filters.mail = '';
      this.filters.service = '';
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
  left: 224px !important;
  position: sticky !important;
  z-index: inherit !important;
  background: var(--v-background-base) !important;
}

.table-fixed-col :deep(thead > tr > th:nth-child(4)),
.table-fixed-col :deep(tbody > tr > td:nth-child(4)) {
  left: 424px !important;
  position: sticky !important;
  z-index: inherit !important;
  background: var(--v-background-base) !important;
}

.table-fixed-col :deep(thead > tr > th:nth-child(1)),
.table-fixed-col :deep(thead > tr > th:nth-child(2)),
.table-fixed-col :deep(thead > tr > th:nth-child(3)),
.table-fixed-col :deep(thead > tr > th:nth-child(4)) {
  z-index: 3 !important;
}

.table-fixed-col :deep(tbody > tr:hover > td:nth-child(1)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(2)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(3)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(4)) {
  background: var(--v-thover-base) !important;
}

.table-fixed-col :deep(tbody > tr:hover) {
  background: var(--v-thover-base) !important;
}
</style>
