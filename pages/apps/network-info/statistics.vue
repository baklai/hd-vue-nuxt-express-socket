<template>
  <v-container full-height class="py-8" v-if="$hasScope('api:statistic:ipaddress')">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-monitor-cellphone </v-icon>
            <v-spacer />
            {{ count }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of records') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-wan </v-icon>
            <v-spacer />
            {{ channels }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of channels') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-expansion-card-variant </v-icon>
            <v-spacer />
            {{ units ? units : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of units') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-security-network </v-icon>
            <v-spacer />
            {{ vpns ? vpns : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of VPNs') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-map-marker-outline </v-icon>
            <v-spacer />
            {{ locations ? locations : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of locations') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ companies ? companies : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of companies') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ branches ? branches : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of branches') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ enterprises ? enterprises : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of enterprises') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-web </v-icon>
            <v-spacer />
            {{ internet ? internet : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of Internets') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-at </v-icon>
            <v-spacer />
            {{ email ? email : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of E-Mails') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-swap-horizontal-bold </v-icon>
            <v-spacer />
            {{ autoanswer ? autoanswer : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of autoanswers') }} </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" xl="6" lg="6">
        <v-card class="pa-2" outlined tile>
          <v-card-title>
            {{ $t('Devices status') }}
          </v-card-title>
          <v-card-text>
            <charts-bar :data="barChartUnits" :options="barChartOptions" :height="200" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="6" lg="6">
        <v-card class="pa-2" outlined tile>
          <v-card-title>
            {{ $t('Locations status') }}
          </v-card-title>
          <v-card-text>
            <charts-bar :data="barChartLocations" :options="barChartOptions" :height="200" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="6" lg="6">
        <v-card class="pa-2" outlined tile>
          <v-card-title>
            {{ $t('Branches status') }}
          </v-card-title>
          <v-card-text>
            <charts-bar :data="barChartBranches" :options="barChartOptions" :height="200" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="6" lg="6">
        <v-card class="pa-2" outlined tile>
          <v-card-title>
            {{ $t('Enterprises status') }}
          </v-card-title>
          <v-card-text>
            <charts-bar :data="barChartEnterprises" :options="barChartOptions" :height="200" />
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
    appsubtitle: 'Network IP Address of the technical support department'
  },

  async asyncData({ store }) {
    const statistic = await store.dispatch('api/statistic/ipaddress');

    const barChartUnits = {
      labels: statistic.barUnits.map((a) => a.title),
      datasets: [
        {
          label: 'Units',
          data: statistic.barUnits.map((a) => a.count),
          backgroundColor: 'rgb(154, 208, 245, 0.9)'
        }
      ]
    };

    const barChartLocations = {
      labels: statistic.barLocations.map((a) => a.title),
      datasets: [
        {
          label: 'Locations',
          data: statistic.barLocations.map((a) => a.count),
          backgroundColor: 'rgb(154, 208, 245, 0.9)'
        }
      ]
    };

    const barChartBranches = {
      labels: statistic.barBranches.map((a) => a.title),
      datasets: [
        {
          label: 'Branches',
          data: statistic.barBranches.map((a) => a.count),
          backgroundColor: 'rgb(154, 208, 245, 0.9)'
        }
      ]
    };

    const barChartEnterprises = {
      labels: statistic.barEnterprises.map((a) => a.title),
      datasets: [
        {
          label: 'Enterprises',
          data: statistic.barEnterprises.map((a) => a.count),
          backgroundColor: 'rgb(154, 208, 245, 0.9)'
        }
      ]
    };

    return {
      ...statistic,
      barChartUnits,
      barChartLocations,
      barChartBranches,
      barChartEnterprises
    };
  },

  data() {
    return {
      barChartOptions: {
        responsive: true,
        title: {
          display: false
        },
        scales: {
          yAxes: [
            {
              type: 'logarithmic',
              ticks: {
                min: 0,
                max: 10000,
                callback: function (value, index, values) {
                  if (value === 10000) return '10K';
                  if (value === 5000) return '5K';
                  if (value === 1000) return '1K';
                  if (value === 100) return '100';
                  if (value === 10) return '10';
                  if (value === 1) return '1';
                  return null;
                }
              }
            }
          ]
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
