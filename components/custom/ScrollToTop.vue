<template>
  <v-scale-transition>
    <v-btn
      fab
      dark
      small
      right
      bottom
      absolute
      v-show="show"
      v-scroll:#report="onScroll"
      @click="scrollTo('report')"
      class="primary mb-10"
    >
      <v-icon> mdi-chevron-up </v-icon>
    </v-btn>
  </v-scale-transition>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  },
  methods: {
    onScroll(e) {
      const top = e.target.scrollTop || 0;
      this.show = top > 60;
    },

    scrollTo(href) {
      const element = document.getElementById(href);
      if (element) {
        element.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
  }
};
</script>
