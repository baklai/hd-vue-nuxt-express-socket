<template>
  <v-container fill-height fluid class="pa-0" v-resize="onResize">
    <ModalsDelete
      ref="delete"
      @closeEvent="getItems"
      v-if="$hasScope('api:inspector:remove:one')"
    />
    <ReportsModalSysInspector ref="modal" v-if="$hasScope('api:inspector:find:one')" />
    <v-data-table
      dense
      fixed-header
      item-key="id"
      :items="items"
      :loading="loading"
      :headers="headers"
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
              <v-list-item-title class="text-truncate">
                {{ $t(apppage.apptitle) }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                {{ $t(apppage.appsubtitle) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-spacer />
          <v-responsive width="210" class="mr-2">
            <CustomFilterInput v-model="filters.host" :label="$t('Search IP Address')" />
          </v-responsive>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="cleanFilters" class="mx-2">
                <v-icon> mdi-filter-remove-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('Clear filters') }} </span>
          </v-tooltip>
          <v-tooltip bottom v-if="$hasScope('api:tool:get:inspector')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-on="on" v-bind="attrs" @click="getVBSInspector" class="mx-2">
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
            <v-list-item @click="cleanFilters">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-filter-remove-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Clear filters') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="getVBSInspector">
              <v-list-item-icon class="mr-2">
                <v-icon small> mdi-cloud-download-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('VBS Inspector') }}
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
          <v-list flat dense v-if="$hasScope('app:inspector:export:table')">
            <v-list-item
              @click="
                $store.dispatch('exportCSV', {
                  delimiter: ';',
                  fileName: 'inspector'
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

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <HostDefActions :host="item.host" />
            <v-divider />
            <v-list-item v-if="$hasScope('api:inspector:remove:one')" @click="onItemDel(item.id)">
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
            <strong> IP {{ item.host }} </strong>
            <v-spacer />
          </v-system-bar>
        </v-menu>
      </template>

      <template v-slot:[`header.actions`]="{ header }">
        {{ header.text }}
        <v-icon small> mdi-cog-outline </v-icon>
      </template>

      <template v-slot:[`header.system.csname`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.csname" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.warnings.useraccount`]="{ header }">
        {{ header.text }}
        <CustomFilterSwitch v-model="filters.useraccount" :label="$t('Show users warning')" />
      </template>

      <template v-slot:[`header.warnings.product`]="{ header }">
        {{ header.text }}
        <CustomFilterSwitch v-model="filters.product" :label="$t('Show products warning')" />
      </template>

      <template v-slot:[`header.warnings.share`]="{ header }">
        {{ header.text }}
        <CustomFilterSwitch v-model="filters.share" :label="$t('Show shares warning')" />
      </template>

      <template v-slot:[`header.system.osname`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.osname" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.system.platform`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.platform" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.system.version`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.version" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`header.cpu`]="{ header }">
        {{ header.text }}
        <CustomFilterTextField v-model="filters.cpu" :label="$t('Search in column')" />
      </template>

      <template v-slot:[`item.system.csname`]="{ item }">
        <v-icon x-small left> mdi-monitor </v-icon>
        <span class="cursor-weight-medium" @click="onItemDrawer(item.id)">
          {{ item.system.csname }}
        </span>
      </template>

      <template v-slot:[`item.host`]="{ item }">
        <span class="cursor-color-bold" @click="onItem(item.id)">
          {{ item.host }}
        </span>
      </template>

      <template v-slot:[`item.updated`]="{ item }">
        {{ item.updated | dateTimeToStr }}
      </template>

      <template v-slot:[`item.system.platform`]="{ item }">
        {{ item.system.platform ? item.system.platform : '32-bit' }}
      </template>

      <template v-slot:[`item.ram`]="{ item }">
        {{ item.ram | byteFormat }}
      </template>

      <template v-slot:[`item.hdd`]="{ item }">
        {{ item.hdd | byteFormat }}
      </template>

      <template v-slot:[`item.warnings.useraccount`]="{ item }">
        <v-chip
          small
          :outlined="item.warnings.useraccount ? false : true"
          :color="item.warnings.useraccount ? 'warning' : 'default'"
          class="table-fixed-chip"
        >
          {{ item.total.useraccount }}
        </v-chip>
      </template>

      <template v-slot:[`item.warnings.product`]="{ item }">
        <v-chip
          small
          :outlined="item.warnings.product ? false : true"
          :color="item.warnings.product ? 'warning' : 'default'"
          class="table-fixed-chip"
        >
          {{ item.total.product }}
        </v-chip>
      </template>

      <template v-slot:[`item.warnings.share`]="{ item }">
        <v-chip
          small
          :outlined="item.warnings.share ? false : true"
          :color="item.warnings.share ? 'warning' : 'default'"
          class="table-fixed-chip"
        >
          {{ item.total.share }}
        </v-chip>
      </template>
    </v-data-table>
    <ReportsDrawerSysInspector ref="drawer" v-if="$hasScope('api:inspector:find:one')" />
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-monitor-dashboard',
    apptitle: 'PC SysInspector',
    appsubtitle: 'PC SysInspector service of the technical support department'
  },

  data() {
    return {
      windowSize: { x: 0, y: 0 },
      loading: false,
      items: [],
      filters: {
        perpage: 15,
        host: '',
        csname: '',
        useraccount: '',
        product: '',
        share: '',
        osname: '',
        platform: '',
        version: '',
        cpu: ''
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
          text: this.$t('PC Name'),
          value: 'system.csname',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.csname) return true;
            if (value) return value.includes(this.filters.csname.toLowerCase());
          }
        },
        {
          text: this.$t('IP Address'),
          value: 'host',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.host) return true;
            return value.includes(this.filters.host);
          }
        },
        {
          text: this.$t('Users'),
          value: 'warnings.useraccount',
          align: 'start',
          width: '160px',
          filterable: true,
          sortable: false,
          filter: (value) => {
            if (!this.filters.useraccount) return true;
            return value;
          }
        },
        {
          text: this.$t('Products'),
          value: 'warnings.product',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: false,
          filter: (value) => {
            if (!this.filters.product) return true;
            return value;
          }
        },
        {
          text: this.$t('SMB Share'),
          value: 'warnings.share',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: false,
          filter: (value) => {
            if (!this.filters.share) return true;
            return value;
          }
        },
        {
          text: this.$t('Report date'),
          value: 'updated',
          align: 'start',
          width: '180px',
          filterable: false,
          sortable: true
        },
        {
          text: this.$t('OS Name'),
          value: 'system.osname',
          align: 'start',
          width: '250px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.osname) return true;
            if (value) return value.toLowerCase().includes(this.filters.osname.toLowerCase());
          }
        },
        {
          text: this.$t('OS Platform'),
          value: 'system.platform',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.platform) return true;
            if (value) return value.toLowerCase().includes(this.filters.platform.toLowerCase());
          }
        },
        {
          text: this.$t('OS Version'),
          value: 'system.version',
          align: 'start',
          width: '150px',
          filterable: true,
          sortable: true,
          filter: (value) => {
            if (!this.filters.version) return true;
            if (value) return value.toLowerCase().includes(this.filters.version.toLowerCase());
          }
        },
        {
          text: this.$t('CPU'),
          value: 'cpu',
          align: 'start',
          width: '300px',
          filterable: true,
          sortable: false,
          filter: (value) => {
            if (!this.filters.cpu) return true;
            if (value) return value.toLowerCase().includes(this.filters.cpu.toLowerCase());
          }
        },
        {
          text: this.$t('RAM'),
          value: 'ram',
          align: 'start',
          width: '150px',
          filterable: false,
          sortable: false
        },
        {
          text: this.$t('HDD'),
          value: 'hdd',
          align: 'start',
          width: '150px',
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

    byteFormat: function (value) {
      if (!value) return '-';
      const index = Math.floor(Math.log(value) / Math.log(1024));
      return (
        (value / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
      );
    }
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },

    async getItems() {
      try {
        this.loading = true;
        this.items = await this.$store.dispatch('api/inspector/findAll');
        this.$toast.success(this.$t('The list of records has been updated'));
      } catch (err) {
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    onItem(id) {
      if (this.$hasScope('api:inspector:find:one')) {
        this.$refs.modal.onItem(id);
      }
    },

    onItemDrawer(id) {
      if (this.$hasScope('api:inspector:find:one')) {
        this.$refs.drawer.onItem(id);
      }
    },

    onItemDel(id) {
      if (this.$hasScope('api:inspector:remove:one')) {
        this.$refs.delete.onConfirm(id, 'inspector');
      }
    },

    cleanFilters() {
      this.filters.perpage = 15;
      this.filters.host = '';
      this.filters.csname = '';
      this.filters.useraccount = '';
      this.filters.product = '';
      this.filters.share = '';
      this.filters.osname = '';
      this.filters.platform = '';
      this.filters.version = '';
      this.filters.cpu = '';
    },

    async getVBSInspector() {
      const file = await this.$store.dispatch('api/tool/getVBS');
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inspector.vbs`);
      this.$toast.success(this.$t('VBS File created'));
      link.click();
    }
  }
};
</script>

<style scoped>
.table-fixed-chip {
  position: static !important;
  pointer-events: none !important;
}

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
