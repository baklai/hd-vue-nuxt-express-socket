<template>
  <v-navigation-drawer app right clipped permanent width="500" v-model="drawer" v-if="report">
    <ModalsDelete ref="delete" @closeEvent="close" />
    <ModalsRequest ref="request" @closeEvent="close" />
    <template v-slot:prepend>
      <v-card tile flat>
        <v-list-item two-line>
          <v-list-item-avatar tile>
            <v-icon large> mdi-book-open-outline </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('Current request').toUpperCase() }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t('Status request') }} :
              {{ report.closed ? $t('Request closed') : $t('Request opened') }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon> mdi-dots-vertical </v-icon>
              </v-btn>
            </template>
            <v-list flat dense>
              <HostDefActions v-if="report.ipaddress" :host="report.ipaddress" />
              <v-divider v-if="report.ipaddress" />
              <v-list-item @click="onItem(report.id)" v-if="$hasScope('api:request:update:one')">
                <v-list-item-icon class="mr-1">
                  <v-icon small> mdi-note-edit-outline </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  {{ $t('Edit record') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="$hasScope('api:request:remove:one')" @click="onItemDel(report.id)">
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
              <strong> STATUS </strong>
              <v-spacer />
            </v-system-bar>
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
      </v-card>
    </template>
    <v-row>
      <v-col cols="12" v-if="report">
        <v-card flat class="mx-auto">
          <v-card-title>{{ $t('Current request') }}</v-card-title>
          <v-card-text class="px-2">
            <table>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Opened an request') }} :</td>
                <td>{{ report.workerOpen ? report.workerOpen.name : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Date opened') }} :</td>
                <td>
                  {{ report.created ? dateTimeToStr(report.created) : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Status') }} :</td>
                <td>
                  <v-icon small :color="report.closed ? 'green' : 'red'">
                    {{
                      report.closed ? 'mdi-checkbox-marked-circle-outline' : 'mdi-radiobox-blank'
                    }}
                  </v-icon>
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Request') }} :</td>
                <td>
                  {{ report.request ? report.request : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Location') }} :</td>
                <td>
                  {{ report.location ? report.location.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Fullname') }} :</td>
                <td>{{ report.fullname }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Phone') }} :</td>
                <td>{{ report.phone }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Position') }} :</td>
                <td>
                  {{ report.position ? report.position.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('IP Address') }} :</td>
                <td>
                  {{ report.ipaddress ? report.ipaddress : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Mail number') }} :</td>
                <td>{{ report.mail }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Company') }} :</td>
                <td>
                  {{ report.company ? report.company.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Branch') }} :</td>
                <td>
                  {{ report.branch ? report.branch.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Enterprise') }} :</td>
                <td>
                  {{ report.enterprise ? report.enterprise.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Department') }} :</td>
                <td>
                  {{ report.department ? report.department.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Date closed') }} :</td>
                <td>
                  {{ report.closed ? dateTimeToStr(report.closed) : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Closed an request') }} :</td>
                <td>
                  {{ report.workerClose ? report.workerClose.name : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Conclusion for request') }} :</td>
                <td>{{ report.conclusion }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Comment') }} :</td>
                <td>{{ report.comment }}</td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" v-if="ipaddress">
        <v-card flat class="mx-auto">
          <v-card-title> {{ $t('IP Address') }} </v-card-title>
          <v-card-text class="px-2">
            <table>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Location') }} :</td>
                <td>
                  {{ ipaddress.location ? ipaddress.location.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Unit') }} :</td>
                <td>
                  {{ ipaddress.unit ? ipaddress.unit.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('IP Address') }} :</td>
                <td>{{ ipaddress.ipaddress }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Mask') }} :</td>
                <td>{{ ipaddress.mask }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Gateway') }} :</td>
                <td>{{ ipaddress.gateway }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('№ Mail') }} :</td>
                <td>{{ ipaddress.mail }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Company') }} :</td>
                <td>
                  {{ ipaddress.company ? ipaddress.company.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Branch') }} :</td>
                <td>
                  {{ ipaddress.branch ? ipaddress.branch.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Enterprise') }} :</td>
                <td>
                  {{ ipaddress.enterprise ? ipaddress.enterprise.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Department') }} :</td>
                <td>
                  {{ ipaddress.department ? ipaddress.department.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Fullname') }} :</td>
                <td>{{ ipaddress.fullname }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Position') }} :</td>
                <td>
                  {{ ipaddress.position ? ipaddress.position.title : '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Phone') }} :</td>
                <td>{{ ipaddress.phone }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Autoanswer') }} :</td>
                <td>{{ ipaddress.autoanswer }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Date open') }} :</td>
                <td>{{ ipaddress.date | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Comment') }} :</td>
                <td>{{ ipaddress.comment }}</td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Internet') }} :</td>
                <td>
                  <v-icon x-small :color="ipaddress.status.internet ? 'green' : 'default'">
                    {{ ipaddress.status.internet ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('E-mail') }} :</td>
                <td>
                  <v-icon x-small :color="ipaddress.status.email ? 'green' : 'default'">
                    {{ ipaddress.status.email ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
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
      ipaddress: null
    };
  },

  watch: {
    drawer(val) {
      val || this.close();
    }
  },

  filters: {
    dateToStr: function (value) {
      return value ? new Date(value).toLocaleDateString() : '-';
    }
  },

  methods: {
    async onItem(id) {
      try {
        this.report = await this.$store.dispatch('api/request/findOne', id);
        this.ipaddress = this.report.ipaddress
          ? await this.getIPAddress(this.report.ipaddress)
          : null;
        this.drawer = true;
      } catch (err) {
        this.$toast.error(this.$t('Record not found'));
        this.close();
      }
    },

    async getIPAddress(ip) {
      return await this.$store.dispatch('api/ipaddress/searchOne', ip);
    },

    dateTimeToStr(value) {
      return value ? new Date(value).toLocaleString() : '-';
    },

    close() {
      this.drawer = false;
      this.ipaddress = null;
      this.report = null;
    },

    onItemMod(id) {
      this.$refs.request.onItem(id);
    },

    onItemDel(id) {
      this.$refs.delete.onConfirm(id, 'request');
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
  font-size: 14px;
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
