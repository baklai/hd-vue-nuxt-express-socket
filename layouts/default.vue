<template>
  <client-only>
    <v-app>
      <AppDrawerMini />
      <v-app-bar app flat color="transparent" class="px-4">
        <v-spacer />
        <AppMainMenuBtn />
      </v-app-bar>
      <v-main :style="disabledSelectedFromHTML">
        <nuxt />
      </v-main>
      <AppScrollTop />
    </v-app>
  </client-only>
</template>

<script>
export default {
  head() {
    return {
      title: this.apppage.apptitle
    };
  },
  data() {
    return {
      drawer: true,
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
