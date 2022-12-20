<template>
  <v-app>
    <AppDrawer />
    <AppNavBar />
    <v-main :style="$hasScope('selected-html') ? '' : disabledSelectedFromHTML">
      <nuxt v-if="!$store.state.isMaintenance" />
      <AppMaintenance v-else />
    </v-main>
    <AppScrollTop />
  </v-app>
</template>

<script>
export default {
  middleware: ['is-auth'],

  head() {
    return {
      title: this.apppage.apptitle
    };
  },

  data() {
    return {
      disabledSelectedFromHTML: {
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        '-o-user-select': 'none',
        'user-select': 'none'
      }
    };
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    },
    error() {
      return this.$store.getters.error;
    }
  },

  watch: {
    error(value) {
      this.$toast.error(this.$t(value.response.data.message));
    }
  }
};
</script>
