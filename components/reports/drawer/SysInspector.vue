<template>
  <v-navigation-drawer app right clipped permanent width="400" v-model="drawer" v-if="report">
    <template v-slot:prepend>
      <v-card tile flat>
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
                {{ $t('Report date') }}: {{ report.updated | dateToStr }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-menu offset-y open-on-hover>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" class="mr-2">
                  <v-icon> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-list flat dense subheader>
                <HostDefActions :host="report.host" />
                <v-divider />
                <v-list-item @click="printReport">
                  <v-list-item-icon class="mr-1">
                    <v-icon small> mdi-content-save-outline </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ $t('Create report') }}
                  </v-list-item-title>
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
          </v-list-item>
        </v-list>
      </v-card>
    </template>
    <v-row>
      <v-col v-if="iptable">
        <v-card flat class="mx-auto">
          <v-list-item two-line>
            <v-list-item-avatar tile>
              <v-icon large> mdi-monitor </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ report.os ? report.os.CSName : '-' }}
              </v-list-item-title>
              <v-list-item-subtitle> IP {{ iptable.ipaddress }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset />
          <v-card-text>
            <table>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Location') }} :</td>
                <td>
                  {{ iptable.location ? iptable.location.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Unit') }} :</td>
                <td>
                  {{ iptable.unit ? iptable.unit.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('IP Address') }} :</td>
                <td>{{ iptable.ipaddress }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Mask') }} :</td>
                <td>{{ iptable.mask }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Gateway') }} :</td>
                <td>{{ iptable.gateway }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('№ Mail') }} :</td>
                <td>{{ iptable.mail }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Company') }} :</td>
                <td>
                  {{ iptable.company ? iptable.company.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Branch') }} :</td>
                <td>
                  {{ iptable.branch ? iptable.branch.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Enterprise') }} :</td>
                <td>
                  {{ iptable.enterprise ? iptable.enterprise.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Department') }} :</td>
                <td>
                  {{ iptable.department ? iptable.department.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Fullname') }} :</td>
                <td>{{ iptable.fullname }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Position') }} :</td>
                <td>
                  {{ iptable.position ? iptable.position.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Phone') }} :</td>
                <td>{{ iptable.phone }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Autoanswer') }} :</td>
                <td>{{ iptable.autoanswer }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Date open') }} :</td>
                <td>{{ iptable.date | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Comment') }} :</td>
                <td>{{ iptable.comment }}</td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Internet') }} :</td>
                <td>
                  <v-icon x-small :color="iptable.status.internet ? 'green' : 'default'">
                    {{ iptable.status.internet ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('E-mail') }} :</td>
                <td>
                  <v-icon x-small :color="iptable.status.email ? 'green' : 'default'">
                    {{ iptable.status.email ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="report.os">
        <v-card flat class="mx-auto">
          <v-list-item two-line>
            <v-list-item-avatar tile>
              <v-icon large> mdi-microsoft-windows </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ report.os ? report.os.Caption : '-' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ report.os ? report.os.OSArchitecture : '-' }}
                {{ report.os ? report.os.Version : '-' }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset />
          <v-card-text>
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
          </v-card-text>
        </v-card>
        <v-card flat class="mx-auto">
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
          <v-card-text>
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
                <td>{{ report.os.Version }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('OS Name') }}
                </td>
                <td>{{ report.os.Caption }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  {{ $t('OS Platform') }}
                </td>
                <td>{{ report.os.OSArchitecture }}</td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      report: null,
      iptable: null
    };
  },

  filters: {
    dateToStr: function (value) {
      return value ? new Date(value).toLocaleString() : '-';
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
    drawer(val) {
      val || this.close();
    }
  },

  methods: {
    async onItem(id) {
      try {
        this.report = null;
        this.iptable = null;

        this.report = await this.$store.dispatch('api/inspector/findOne', id);

        this.iptable = await this.$store.dispatch('api/ipaddress/searchOne', this.report.host);

        if (this.report.os) {
          this.$toast.success(this.$t('Report received successfully'));
          this.drawer = true;
        } else {
          this.$toast.error(this.$t('Record not found'));
          this.drawer = false;
        }
      } catch (err) {
        this.$toast.error(this.$t('Record not found'));
        this.close();
      }
    },

    async printReport() {
      try {
        if (process.browser) {
          const html2pdf = require('html2pdf.js');
          const element = document.getElementById('report-container');
          await html2pdf(element, {
            margin: 1,
            filename: `report_${this.report.host}.pdf`,
            jsPDF: {
              orientation: 'landscape',
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
      this.drawer = false;
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
