<template>
  <v-navigation-drawer app right clipped permanent width="400" v-model="drawer" v-if="report">
    <ModalsDelete ref="delete" @closeEvent="close" v-if="$hasScope('api:ipaddress:remove:one')" />
    <ModalsIPAddress
      ref="ipaddress"
      @closeEvent="close"
      v-if="$hasScope('api:ipaddress:find:one')"
    />
    <template v-slot:prepend>
      <v-card tile flat>
        <v-list-item two-line>
          <v-list-item-avatar tile>
            <v-icon large> mdi-ip-network-outline </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> IP {{ report.ipaddress }} </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t('Location') }} : {{ report.location.title }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="mr-2">
                <v-icon> mdi-dots-vertical </v-icon>
              </v-btn>
            </template>
            <v-list flat dense subheader>
              <HostDefActions :host="report.ipaddress" />
              <v-list-item
                @click="onItemMod(report.id)"
                v-if="$hasScope('api:ipaddress:update:one')"
              >
                <v-list-item-icon class="mr-1">
                  <v-icon small> mdi-note-edit-outline </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  {{ $t('Edit record') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="$hasScope('api:ipaddress:remove:one')"
                @click="onItemDel(report.id)"
              >
                <v-list-item-icon class="mr-1">
                  <v-icon small> mdi-trash-can-outline </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  {{ $t('Delete record') }}
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
      </v-card>
    </template>
    <v-row>
      <v-col cols="12" v-if="report">
        <v-card flat class="mx-auto">
          <v-card-title>IP Address</v-card-title>
          <v-card-text class="px-2">
            <table>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Location') }} :</td>
                <td>{{ report.location ? report.location.title : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Unit') }} :</td>
                <td>{{ report.unit ? report.unit.title : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('IP Address') }} :</td>
                <td>{{ report.ipaddress }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Mask') }} :</td>
                <td>{{ report.mask }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Gateway') }} :</td>
                <td>{{ report.gateway }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('№ Mail') }} :</td>
                <td>{{ report.mail }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Company') }} :</td>
                <td>{{ report.company ? report.company.title : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Branch') }} :</td>
                <td>{{ report.branch ? report.branch.title : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Enterprise') }} :</td>
                <td>{{ report.enterprise ? report.enterprise.title : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Department') }} :</td>
                <td>{{ report.department ? report.department.title : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Fullname') }} :</td>
                <td>{{ report.fullname }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Position') }} :</td>
                <td>{{ report.position ? report.position.title : '-' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Phone') }} :</td>
                <td>{{ report.phone }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Autoanswer') }} :</td>
                <td>{{ report.autoanswer }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Date open') }} :</td>
                <td>{{ report.date | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Comment') }} :</td>
                <td>{{ report.comment }}</td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="50%">{{ $t('Internet') }} :</td>
                <td>
                  <v-icon x-small :color="report.status.internet ? 'green' : 'default'">
                    {{ report.status.internet ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
              </tr>

              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('E-mail') }} :</td>
                <td>
                  <v-icon x-small :color="report.status.email ? 'green' : 'default'">
                    {{ report.status.email ? 'mdi-check-bold' : 'mdi-minus' }}
                  </v-icon>
                </td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="$hasScope('app:ipaddress:client:internet')">
      <v-col cols="12" v-if="report.internet">
        <v-card flat class="mx-auto">
          <v-card-title> {{ $t('Internet') }} </v-card-title>
          <v-card-text class="px-2">
            <table>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('№ Mail') }} :</td>
                <td>{{ report.internet.mail }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Date open') }} :</td>
                <td>{{ report.internet.dateOpen | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Date close') }} :</td>
                <td>{{ report.internet.dateClose | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Comment') }} :</td>
                <td>{{ report.internet.comment }}</td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="$hasScope('app:ipaddress:client:email')">
      <v-col cols="12" v-if="report.email">
        <v-card flat class="mx-auto" v-if="report.email.length > 0">
          <v-card-title> {{ $t('E-mail') }} </v-card-title>
          <v-card-text class="px-2">
            <table v-for="email in report.email" :key="email.login">
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Login') }} :</td>
                <td>{{ email.login }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Fullname') }} :</td>
                <td>{{ email.fullname }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('№ Mail') }} :</td>
                <td>{{ email.mail }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Date open') }} :</td>
                <td>{{ email.dateOpen | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Date close') }} :</td>
                <td>{{ email.dateClose | dateToStr }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold" width="40%">{{ $t('Comment') }} :</td>
                <td>{{ email.comment }}</td>
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
      report: null
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
        this.report = await this.$axios.$get(`ipaddress/${id}`, {});
        this.drawer = true;
      } catch (err) {
        this.$toast.error(this.$t('Record not found'));
        this.close();
      }
    },

    close() {
      this.drawer = false;
      this.report = null;
    },

    onItemMod(id) {
      if (this.$hasScope('api:ipaddress:update:one')) {
        this.$refs.ipaddress.onItem(id);
      }
    },

    onItemDel(id) {
      if (this.$hasScope('api:ipaddress:remove:one')) {
        this.$refs.delete.onConfirm(id, 'ipaddress');
      }
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
