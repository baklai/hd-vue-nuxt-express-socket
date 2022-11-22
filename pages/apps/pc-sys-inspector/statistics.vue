<template>
  <v-container full-height class="py-8" v-if="$hasScope('api:statistic:inspector')">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" xl="4" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="info"> mdi-monitor-cellphone </v-icon>
            <v-spacer />
            {{ count }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of reports') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="2" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="info"> mdi-map-marker-outline </v-icon>
            <v-spacer />
            {{ locations }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of locations') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="2" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="info"> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ companies }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of companies') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="2" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="info"> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ branches }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of branches') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="2" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="info"> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ enterprises }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of enterprises') }} </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card dark outlined color="success" class="pa-2">
          <v-card-title>
            <v-icon large> mdi-check-outline </v-icon>
            <v-spacer />
            {{ count - share - product - useraccount }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of success') }} </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card dark outlined color="warning" class="pa-2">
          <v-card-title>
            <v-icon large> mdi-alert-octagon-outline </v-icon>
            <v-spacer />
            {{ share + product + useraccount }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of warnings') }} </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xl="2" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="warning"> mdi-account-key-outline </v-icon>
            <v-spacer />
            {{ useraccount }}
          </v-card-title>
          <v-card-text> {{ $t('Administrator rights') }} </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xl="2" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="warning"> mdi-microsoft </v-icon>
            <v-spacer />
            {{ product }}
          </v-card-title>
          <v-card-text> {{ $t('Unwanted software') }} </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xl="2" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="warning"> mdi-folder-network-outline </v-icon>
            <v-spacer />
            {{ share }}
          </v-card-title>
          <v-card-text> {{ $t('Shared resources') }} </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" md="8">
        <v-card class="pa-2" outlined tile>
          <v-card-title>
            {{ $t('PC Statuses') }}
          </v-card-title>
          <v-card-text>
            <charts-doughnut :data="statusChart" :options="statusChartOptions" :height="200" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="4">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large color="info"> mdi-clock-outline </v-icon>
            <v-spacer />
            {{ $t('Report date') }}
          </v-card-title>
          <v-card-text>
            <table style="width: 100%">
              <tr v-for="item in days" :key="item.days">
                <td width="50%" class="font-weight-bold">
                  {{ Math.round(item.days) }} {{ $t('days') }} :
                </td>
                <td width="50%">{{ item.count }} {{ $t('reports') }}</td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-chart-bar-stacked',
    apptitle: 'Service statistics',
    appsubtitle: 'PC SysInspector service of the technical support department'
  },

  async asyncData({ store }) {
    const statistic = await store.dispatch('api/statistic/inspector');
    const statusChart = {
      labels: ['Ok', 'Users', 'Products', 'Shares'],
      datasets: [
        {
          label: '# of Votes',
          data: [
            statistic.count - statistic.share - statistic.product - statistic.useraccount,
            statistic.useraccount,
            statistic.product,
            statistic.share
          ],
          backgroundColor: ['#4caf50', '#fb8c00', '#fb8c00', '#fb8c00']
        }
      ]
    };
    return { ...statistic, statusChart };
  },

  data() {
    return {
      statusChartOptions: {
        responsive: true,
        title: {
          display: false
        },
        legend: {
          position: 'right'
        }
      }
    };
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    }
  }
};
</script>
