<template>
  <v-card flat tile class="text-center" color="transparent">
    <v-card-text>
      <v-tooltip bottom v-for="item in social" :key="item.title">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            class="mx-2"
            target="_blank"
            :href="item.href"
            :light="reverse ? $vuetify.theme.dark : !$vuetify.theme.dark"
            :dark="reverse ? !$vuetify.theme.dark : $vuetify.theme.dark"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon> {{ item.icon }} </v-icon>
          </v-btn>
        </template>
        <span> {{ item.title }} </span>
      </v-tooltip>
    </v-card-text>
    <span class="caption grey--text text--lighten-1">
      {{ copyright }}
    </span>
  </v-card>
</template>

<script>
export default {
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    social() {
      return this.$store.state.social;
    },
    copyright() {
      return this.$store.getters.copyright;
    }
  }
};
</script>
