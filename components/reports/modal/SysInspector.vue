<template>
  <v-dialog scrollable width="900" v-if="report" v-model="dialog" overlay-color="#525252">
    <v-card>
      <v-card-title class="py-0">
        <v-list flat>
          <v-list-item two-line>
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-monitor-dashboard </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ report.os ? report.os.CSName : report.host }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('Report host') }}: {{ report.host }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ $t('Report date') }}: {{ report.updated | dateTimeToStr }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer />
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" class="mr-2">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense>
            <HostDefActions :host="report.host" />
            <v-divider />
            <v-list-item @click="saveReport">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-content-save-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title> {{ $t('Create report') }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" @click="close">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Close') }} </span>
        </v-tooltip>
      </v-card-title>
      <v-spacer />
      <v-card-text id="report" class="my-4">
        <v-row no-gutters>
          <v-col v-if="report.ipaddress">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-monitor </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ report.os ? report.os.CSName : '-' }}
                </v-list-item-title>
                <v-list-item-subtitle> IP {{ report.ipaddress.ipaddress }} </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Location') }} :</td>
                <td>
                  {{ report.ipaddress.location ? report.ipaddress.location.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Unit') }} :</td>
                <td>
                  {{ report.ipaddress.unit ? report.ipaddress.unit.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('IP Address') }} :</td>
                <td>{{ report.ipaddress.ipaddress }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Mask') }} :</td>
                <td>{{ report.ipaddress.mask }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Gateway') }} :</td>
                <td>{{ report.ipaddress.gateway }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('№ Mail') }} :</td>
                <td>{{ report.ipaddress.mail }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Company') }} :</td>
                <td>
                  {{ report.ipaddress.company ? report.ipaddress.company.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Branch') }} :</td>
                <td>
                  {{ report.ipaddress.branch ? report.ipaddress.branch.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Enterprise') }} :</td>
                <td>
                  {{ report.ipaddress.enterprise ? report.ipaddress.enterprise.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Department') }} :</td>
                <td>
                  {{ report.ipaddress.department ? report.ipaddress.department.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Fullname') }} :</td>
                <td>{{ report.ipaddress.fullname }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Position') }} :</td>
                <td>
                  {{ report.ipaddress.position ? report.ipaddress.position.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Phone') }} :</td>
                <td>{{ report.ipaddress.phone }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Autoanswer') }} :</td>
                <td>{{ report.ipaddress.autoanswer }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Date open') }} :</td>
                <td>{{ report.ipaddress.date | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Comment') }} :</td>
                <td>{{ report.ipaddress.comment }}</td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Internet') }} :</td>
                <td>
                  <v-icon x-small :color="report.ipaddress.status.internet ? 'green' : 'default'">
                    {{ report.ipaddress.status.internet ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('E-mail') }} :</td>
                <td>
                  <v-icon x-small :color="report.ipaddress.status.email ? 'green' : 'default'">
                    {{ report.ipaddress.status.email ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
              </tr>
            </table>
          </v-col>
          <v-divider vertical class="mx-4" v-if="report.ipaddress" />
          <v-col v-if="report.os">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-microsoft-windows </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ report.os.Caption ? report.os.Caption : report.host }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ report.os.OSArchitecture ? report.os.OSArchitecture : '32-bit' }}
                  {{ report.os.Version ? report.os.Version : '' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <v-row justify="center">
              <v-col cols="4" align="center" v-if="report.cpu">
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-avatar class="mb-2">
                      <v-icon large> mdi-memory </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title class="body-2 text-center">
                      <p class="pb-0">{{ $t('CPU') }}</p>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ report.cpu.Name }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="4" align="center" v-if="report.memorychip">
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-avatar class="mb-2">
                      <v-icon large> mdi-expansion-card-variant </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title class="body-2 text-center">
                      <p class="pb-0">{{ $t('RAM') }}</p>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ report.memorychip | memorySum }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="4" align="center" v-if="report.diskdrive">
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-avatar tile class="mb-2">
                      <v-icon large> mdi-harddisk </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title class="body-2 text-center">
                      <p class="pb-0">{{ $t('HDD') }}</p>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ report.diskdrive | diskSum }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-list-item>
              <v-list-item-avatar tile>
                <v-icon large> mdi-microsoft-windows-classic </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('OS Information') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table class="mt-4">
              <tr>
                <td class="font-weight-bold">
                  {{ $t('OS Type') }}
                </td>
                <td>Microsoft Windows</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('OS Version') }}
                </td>
                <td>{{ report.os.Version ? report.os.Version : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('OS Name') }}
                </td>
                <td>{{ report.os.Caption ? report.os.Caption : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('OS Platform') }}
                </td>
                <td>
                  {{ report.os.OSArchitecture ? report.os.OSArchitecture : '32-bit' }}
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-if="report.cpu">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-memory </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('CPU') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('Central processing unit') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Description') }}
                </td>
                <td>{{ report.cpu.Name }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Clock frequency') }}
                </td>
                <td>{{ report.cpu.CurrentClockSpeed }} MHz</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Number of cores') }}
                </td>
                <td>{{ report.cpu.NumberOfCores }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Number of logical cores') }}
                </td>
                <td>{{ report.cpu.NumberOfLogicalProcessors }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Type of architecture') }}
                </td>
                <td>{{ report.cpu.Architecture }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Manufacturer') }}
                </td>
                <td>{{ report.cpu.Manufacturer }}</td>
              </tr>
            </table>
          </v-col>
          <v-col cols="12" v-if="report.memorychip">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-expansion-card-variant </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('RAM') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('Random access memory') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table v-for="(item, index) in report.memorychip" :key="index">
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Capacity') }}
                </td>
                <td>{{ item.Capacity | bitTo }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Clock frequency') }}
                </td>
                <td>{{ item.Speed }} MHz</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Manufacturer') }}
                </td>
                <td>{{ item.Manufacturer }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Description') }}
                </td>
                <td>{{ item.Description }}</td>
              </tr>
            </table>
          </v-col>
          <v-col cols="12" v-if="report.diskdrive">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-harddisk </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('HDD') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('Number of harddisk') }} :
                  {{ report.diskdrive.length }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table v-for="(item, index) in report.diskdrive" :key="index">
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Type') }}
                </td>
                <td>{{ item.Description }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Description') }}
                </td>
                <td>{{ item.Caption }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Capacity') }}
                </td>
                <td>{{ item.Size | bitTo }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Serial number') }}
                </td>
                <td>{{ item.SerialNumber }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('Manufacturer') }}
                </td>
                <td>{{ item.Manufacturer }}</td>
              </tr>
            </table>
          </v-col>
          <v-col cols="12" v-if="report.printer">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-printer </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('Printers') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('Number of printers') }} :
                  {{ report.printer.length }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table>
              <tr v-for="printer in report.printer" :key="printer.name">
                <td class="font-weight-bold">
                  {{ $t('Name') }}
                </td>
                <td>{{ printer.Name }}</td>
              </tr>
            </table>
          </v-col>
          <v-col cols="12" v-if="report.useraccount">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-account-multiple </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('Local users') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('Number of users') }} :
                  {{ report.useraccount.length }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-icon left small color="warning"> mdi-account-key-outline </v-icon>
                  {{ $t('Account have administrator rights') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table>
              <tr>
                <th></th>
                <th>{{ $t('Name') }}</th>
                <th>{{ $t('Description') }}</th>
                <th>{{ $t('Status') }}</th>
              </tr>
              <tr v-for="user in report.useraccount" :key="user.name">
                <td>
                  <v-icon small color="warning">
                    {{ report.useradmin.includes(user.Name) ? 'mdi-account-key-outline' : '' }}
                  </v-icon>
                </td>
                <td>{{ user.Name }}</td>
                <td width="50%">{{ user.Description }}</td>
                <td>
                  <v-chip small outlined :color="user.Disabled ? 'default' : 'success'">
                    {{ user.Disabled ? $t('Off') : $t('On') }}
                  </v-chip>
                </td>
              </tr>
            </table>
          </v-col>
          <v-col cols="12" v-if="report.product">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-apps </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('Installed apps') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('Number of applications') }} :
                  {{ report.product.length }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-icon left small color="warning"> mdi-microsoft </v-icon>
                  {{ $t('Unwanted software') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table>
              <tr>
                <th></th>
                <th class="text-uppercase">{{ $t('Name') }}</th>
                <th class="text-uppercase">{{ $t('Publisher') }}</th>
                <th class="text-uppercase">{{ $t('Version') }}</th>
                <th class="text-uppercase">
                  {{ $t('Installation date') }}
                </th>
              </tr>
              <tr v-for="(product, index) in report.product" :key="index">
                <td>
                  <v-icon small color="warning">
                    {{ product.Name === 'software' ? 'mdi-microsoft' : '' }}
                  </v-icon>
                </td>
                <td width="50%">{{ product.Name }}</td>
                <td>{{ product.Vendor }}</td>
                <td>{{ product.Version }}</td>
                <td>{{ product.InstallDate | strToDate }}</td>
              </tr>
            </table>
          </v-col>
          <v-col cols="12" v-if="report.share">
            <v-list-item two-line>
              <v-list-item-avatar tile>
                <v-icon large> mdi-folder-account </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('Shared resources') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('Number of resources') }} :
                  {{ report.share.length }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-icon left small color="warning"> mdi-folder-network-outline </v-icon>
                  {{ $t('Shared resources') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset />
            <table>
              <tr>
                <th></th>
                <th>{{ $t('Name') }}</th>
                <th>{{ $t('Path') }}</th>
                <th>{{ $t('Description') }}</th>
              </tr>
              <tr v-for="share in report.share" :key="share.name">
                <td>
                  <v-icon small color="warning">
                    {{ share.Type === 0 ? 'mdi-folder-network-outline' : '' }}
                  </v-icon>
                </td>
                <td>{{ share.Name }}</td>
                <td width="50%">{{ share.Path }}</td>
                <td>{{ share.Description }}</td>
              </tr>
            </table>
          </v-col>
        </v-row>
        <CustomScrollToTop />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      report: null
    };
  },

  filters: {
    dateTimeToStr: function (value) {
      return value ? new Date(value).toLocaleString() : '-';
    },

    dateToStr: function (value) {
      return value ? new Date(value).toLocaleDateString() : '-';
    },

    strToDate: function (value) {
      return [value.slice(0, 4), '/', value.slice(4, 6), '/', value.slice(6)].join('');
    },

    bitTo: function (value) {
      const index = Math.floor(Math.log(value) / Math.log(1024));
      return (
        (value / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
      );
    },

    memorySum: function (value) {
      const summa = value.reduce(
        (accumulator, { Capacity }) => Number(accumulator) + Number(Capacity),
        0
      );
      const index = Math.floor(Math.log(summa) / Math.log(1024));
      return (
        (summa / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
      );
    },

    diskSum: function (value) {
      const summa = value.reduce((accumulator, { Size }) => Number(accumulator) + Number(Size), 0);
      const index = Math.floor(Math.log(summa) / Math.log(1024));
      return (
        (summa / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
      );
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    async onItem(id) {
      try {
        this.report = null;
        this.report = await this.$store.dispatch('api/inspector/findOne', id);
        const ipaddress = await this.$store.dispatch('api/ipaddress/searchOne', this.report.host);
        this.report.ipaddress = ipaddress;
        if (this.report.os) {
          this.$toast.success(this.$t('Report received successfully'));
          this.dialog = true;
        } else {
          this.$toast.error(this.$t('Record not found'));
          this.dialog = false;
        }
      } catch (err) {
        this.$toast.error(this.$t('Record not found'));
        this.close();
      }
    },

    async saveReport() {
      try {
        if (process.browser) {
          const html2pdf = require('html2pdf.js');
          const element = document.getElementById('report');
          await html2pdf(element, {
            margin: 1,
            filename: `SYSINSPECTOR_${this.report.host} (${new Date(
              this.report.updated
            ).toLocaleDateString()}).pdf`,
            jsPDF: {
              orientation: 'portrait',
              format: 'a4',
              floatPrecision: 16
            }
          });
          this.$toast.success(this.$t('Report created successfully'));
        }
      } catch (err) {
        this.$toast.error(this.$t('An unexpected error has occurred'));
      }
    },

    close() {
      this.dialog = false;
      this.report = null;
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border: 15px solid transparent;
  border-top: 5px solid transparent;
  border-collapse: collapse;
}

th {
  font-size: 14px;
  font-weight: bold;
  padding: 5px;
  border: none;
  text-align: left;
  background: transparent;
  text-transform: uppercase;
}

td {
  font-size: 12px;
  padding: 3px;
  border: none;
}

.theme--light td,
th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.theme--dark td,
th {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
