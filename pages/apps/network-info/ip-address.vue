<template>
  <v-container fill-height fluid class="pa-0" v-resize="onResize">
    <ModalsDelete
      ref="delete"
      @closeEvent="getItems"
      v-if="$hasScope('api:ipaddress:remove:one')"
    />
    <ModalsIPAddress
      ref="ipaddress"
      @closeEvent="getItems"
      v-if="$hasScope('api:ipaddress:find:one')"
    />
    <v-data-table
      dense
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
      :height="windowSize.y - 64 - 64 - 59 - 4"
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
            <CustomFilterInput v-model="filters.ipaddress" :label="$t('Search IP Address')" />
          </v-responsive>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="cleanFilters()" class="mx-2">
                <v-icon> mdi-filter-remove-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Clear filters') }} </span>
          </v-tooltip>
          <v-tooltip bottom v-if="$hasScope('api:ipaddress:create:one')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="onItem(null)" class="mx-2">
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
            <v-list-item @click="onItem(null)" v-if="$hasScope('api:ipaddress:create:one')">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-plus-circle-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Create record') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          top
          offset-y
          v-if="
            $hasScope('app:ipaddress:export:table') || $hasScope('app:ipaddress:export:internet')
          "
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text outlined v-bind="attrs" v-on="on" class="ml-2">
              <v-icon small left> mdi-file-chart-outline </v-icon>
              {{ $t('Reports') }}
              <v-icon small right> mdi-chevron-up </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item
              v-if="$hasScope('app:ipaddress:export:table')"
              @click="
                $store.dispatch('exportCSV', {
                  delimiter: ';',
                  fileName: 'iptable'
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
            <v-list-item
              v-if="$hasScope('app:ipaddress:export:internet')"
              @click="exportInternet('donetsk')"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-content-save-check-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Export Internet records') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu top offset-y>
          <ModalsCompany ref="company" v-if="$hasScope('api:company:find:all')" />
          <ModalsBranch ref="branch" v-if="$hasScope('api:branch:find:all')" />
          <ModalsEnterprise ref="enterprise" v-if="$hasScope('api:enterprise:find:all')" />
          <ModalsDepartment ref="department" v-if="$hasScope('api:department:find:all')" />
          <ModalsLocation ref="location" v-if="$hasScope('api:location:find:all')" />
          <ModalsPosition ref="position" v-if="$hasScope('api:position:find:all')" />
          <ModalsUnit ref="unit" v-if="$hasScope('api:unit:find:all')" />

          <template v-slot:activator="{ on, attrs }">
            <v-btn small text outlined v-bind="attrs" v-on="on" class="ml-2">
              <v-icon small left> mdi-database-cog-outline </v-icon>
              {{ $t('DB Tables') }}
              <v-icon small right> mdi-chevron-up </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <v-list-item
              @click="$refs.company.onItem(null)"
              v-if="$hasScope('api:company:find:all')"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-database-search-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('DB Company') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$refs.branch.onItem(null)" v-if="$hasScope('api:branch:find:all')">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-database-search-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('DB Branch') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="$refs.enterprise.onItem(null)"
              v-if="$hasScope('api:enterprise:find:all')"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-database-search-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('DB Enterprise') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="$refs.department.onItem(null)"
              v-if="$hasScope('api:department:find:all')"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-database-search-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('DB Department') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="$refs.location.onItem(null)"
              v-if="$hasScope('api:location:find:all')"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-database-search-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('DB Location') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="$refs.position.onItem(null)"
              v-if="$hasScope('api:position:find:all')"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-database-search-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('DB Position') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$refs.unit.onItem(null)" v-if="$hasScope('api:unit:find:all')">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-database-search-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('DB Unit') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:[`header.actions`]="{ header }">
        {{ header.text }}
        <v-icon small> mdi-cog-outline </v-icon>
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

      <template v-slot:[`header.position`]="{ header }">
        {{ header.text }}
        <CustomFilterSelect
          v-model="filters.position"
          :items="positions"
          :itemValue="'id'"
          :itemText="'title'"
          :label="$t('Search in column')"
        />
      </template>

      <template v-slot:[`header.phone`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.phone" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.mail`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.mail" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.autoanswer`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.autoanswer" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.internet`]="{ header }">
        {{ header.text }}
        <CustomFilterSwitch
          v-model="filters.internet"
          :label="$t('Show only Internet activated')"
        />
      </template>

      <template v-slot:[`header.email`]="{ header }">
        {{ header.text }}
        <CustomFilterSwitch v-model="filters.email" :label="$t('Show only E-mails activated')" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <HostDefActions :host="item.ipaddress" />
            <v-list-item @click="onItem(item.id)" v-if="$hasScope('api:ipaddress:update:one')">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-note-edit-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Edit record') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onItemDel(item.id)" v-if="$hasScope('api:ipaddress:remove:one')">
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
            <strong> IP {{ item.ipaddress }} </strong>
            <v-spacer />
          </v-system-bar>
        </v-menu>
      </template>

      <template v-slot:[`item.location`]="{ item }">
        {{ item.location ? item.location.title : '-' }}
      </template>

      <template v-slot:[`item.unit`]="{ item }">
        {{ item.unit ? item.unit.title : '-' }}
      </template>

      <template v-slot:[`item.ipaddress`]="{ item }">
        <span class="cursor-color-bold" @click="onDrawer(item.id)">
          {{ item.ipaddress }}
        </span>
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

      <template v-slot:[`item.date`]="{ item }">
        {{ item.date | dateToStr }}
      </template>

      <template v-slot:[`item.internet`]="{ item }">
        <v-icon x-small :color="item.status.internet ? 'green' : 'default'">
          {{ item.status.internet ? 'mdi-check-bold' : 'mdi-minus' }}
        </v-icon>
      </template>

      <template v-slot:[`item.email`]="{ item }">
        <v-icon x-small :color="item.status.email ? 'green' : 'default'">
          {{ item.status.email ? 'mdi-check-bold' : 'mdi-minus' }}
        </v-icon>
      </template>
    </v-data-table>
    <ReportsDrawerIPAddress ref="drawer" v-if="$hasScope('api:ipaddress:find:one')" />
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-ip-network-outline',
    apptitle: 'Network IP Address',
    appsubtitle: 'Network IP Address of the technical support department'
  },
  async asyncData({ store }) {
    const [units, locations, positions, companies, branches, enterprises, departments] =
      await Promise.all([
        store.dispatch('api/unit/findAll'),
        store.dispatch('api/location/findAll'),
        store.dispatch('api/position/findAll'),
        store.dispatch('api/company/findAll'),
        store.dispatch('api/branch/findAll'),
        store.dispatch('api/enterprise/findAll'),
        store.dispatch('api/department/findAll')
      ]);

    return {
      units,
      locations,
      positions,
      companies,
      branches,
      enterprises,
      departments
    };
  },
  data() {
    return {
      windowSize: { x: 0, y: 0 },
      loading: false,
      freeip: false,
      items: [],
      total: 0,
      options: {},
      filters: {
        location: '',
        unit: '',
        ipaddress: '',
        company: '',
        branch: '',
        enterprise: '',
        department: '',
        fullname: '',
        position: '',
        phone: '',
        mail: '',
        autoanswer: '',
        internet: '',
        email: ''
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
          text: this.$t('Location'),
          value: 'location',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Unit'),
          value: 'unit',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('IP Address'),
          value: 'ipaddress',
          align: 'start',
          width: '120px',
          filterable: true,
          sortable: false
        },
        {
          text: this.$t('Company'),
          value: 'company',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Branch'),
          value: 'branch',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Enterprise'),
          value: 'enterprise',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Department'),
          value: 'department',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Fullname'),
          value: 'fullname',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Position'),
          value: 'position',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Phone'),
          value: 'phone',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: false
        },
        {
          text: this.$t('Autoanswer'),
          value: 'autoanswer',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Mail'),
          value: 'mail',
          align: 'start',
          width: '200px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Date'),
          value: 'date',
          align: 'start',
          width: '200px',
          filterable: false,
          sortable: false
        },
        {
          text: this.$t('Internet'),
          value: 'internet',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: false
        },

        {
          text: this.$t('E-mail'),
          value: 'email',
          align: 'start',
          width: '150px',
          filterable: true,
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
        this.$refs.drawer.close();
        this.loading = true;
        const data = await this.$store.dispatch('api/ipaddress/findAll', {
          options: this.options,
          filters: Object.fromEntries(
            Object.entries(this.filters).filter(function ([key, value]) {
              return value;
            })
          )
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

    onDrawer(id) {
      if (this.$hasScope('api:ipaddress:find:one')) {
        this.$refs.drawer.onItem(id);
      }
    },

    onItem(id) {
      this.$refs.drawer.close();
      if (this.$hasScope('api:ipaddress:find:one')) {
        this.$refs.ipaddress.onItem(id);
      }
    },

    onItemDel(id) {
      if (this.$hasScope('api:ipaddress:remove:one')) {
        this.$refs.delete.onConfirm(id, 'ipaddress');
      }
    },

    cleanFilters() {
      this.options.page = 1;
      this.options.itemsPerPage = 15;
      this.filters.location = '';
      this.filters.unit = '';
      this.filters.ipaddress = '';
      this.filters.company = '';
      this.filters.branch = '';
      this.filters.enterprise = '';
      this.filters.department = '';
      this.filters.fullname = '';
      this.filters.position = '';
      this.filters.phone = '';
      this.filters.mail = '';
      this.filters.autoanswer = '';
      this.filters.internet = '';
      this.filters.email = '';
    },

    async exportInternet(fileName) {
      if (this.$hasScope('app:ipaddress:export:internet')) {
        const items = await this.$store.dispatch('api/ipaddress/findAll', {
          options: { itemsPerPage: -1 },
          filters: { internet: true }
        });
        let data = [];
        for (let item of items.docs) {
          if (item.status.internet) {
            data.push(
              `${item.ipaddress} # % ${item.location ? item.location.title : '-'} % ${
                item.branch ? item.branch.title : '-'
              } % ${item.enterprise ? item.enterprise.title : '-'} % ${
                item.department ? item.department.title : '-'
              } % ${item.position ? item.position.title : '-'} % ${item.fullname} % ${
                item.internet ? item.internet.mail : '-'
              } % ${item.internet ? new Date(item.internet.dateOpen).toLocaleDateString() : '-'}`
            );
          }
        }
        const txtData = new Blob([data.join('\n')], {
          type: 'text/plain;charset=utf-8'
        });
        const txtUrl = URL.createObjectURL(txtData);
        const hiddenElement = document.createElement('a');
        hiddenElement.href = txtUrl;
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName + '.txt';
        hiddenElement.click();
      }
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

.table-fixed-col :deep(thead > tr > th:nth-child(3)),
.table-fixed-col :deep(tbody > tr > td:nth-child(3)) {
  left: 44px !important;
  position: sticky !important;
  z-index: inherit !important;
  background: var(--v-background-base) !important;
}

.table-fixed-col :deep(thead > tr > th:nth-child(4)),
.table-fixed-col :deep(tbody > tr > td:nth-child(4)) {
  left: 194px !important;
  position: sticky !important;
  z-index: inherit !important;
  background: var(--v-background-base) !important;
}

.table-fixed-col :deep(thead > tr > th:nth-child(1)),
.table-fixed-col :deep(thead > tr > th:nth-child(3)),
.table-fixed-col :deep(thead > tr > th:nth-child(4)) {
  z-index: 3 !important;
}

.table-fixed-col :deep(tbody > tr:hover > td:nth-child(1)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(3)),
.table-fixed-col :deep(tbody > tr:hover > td:nth-child(4)) {
  background: var(--v-thover-base) !important;
}

.table-fixed-col :deep(tbody > tr:hover) {
  background: var(--v-thover-base) !important;
}
</style>
