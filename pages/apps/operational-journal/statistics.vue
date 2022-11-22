<template>
  <v-container full-height class="py-8" v-if="$hasScope('api:statistic:request')">
    <v-row class="fill-height">
      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-book-open-outline </v-icon>
            <v-spacer />
            {{ requests ? requests : 0 }}
          </v-card-title>
          <v-card-text>
            {{ $t('Total number of requests') }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-expansion-card-variant </v-icon>
            <v-spacer />
            {{ units ? units : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of units') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-map-marker-outline </v-icon>
            <v-spacer />
            {{ locations ? locations : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of locations') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-map-marker-outline </v-icon>
            <v-spacer />
            {{ positions ? positions : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of positions') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ companies ? companies : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of companies') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ branches ? branches : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of branches') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ enterprises ? enterprises : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of enterprises') }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="10" xl="3" lg="3" md="4" sm="6">
        <v-card outlined class="pa-2">
          <v-card-title>
            <v-icon large> mdi-office-building-outline </v-icon>
            <v-spacer />
            {{ departments ? departments : 0 }}
          </v-card-title>
          <v-card-text> {{ $t('Total number of departments') }} </v-card-text>
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
    appsubtitle: 'Operational journal of the technical support department'
  },

  async asyncData({ store }) {
    const statistic = await store.dispatch('api/statistic/request');

    return {
      ...statistic
    };
  },

  data() {
    return {};
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    }
  }
};
</script>
