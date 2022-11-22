<template>
  <v-card
    flat
    class="filter-card"
    :style="`left: calc(50% + ${drawer ? '160px' : '0px'}) !important;`"
  >
    <v-card-text>
      <svg style="width: 64px; height: 64px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M14.73,20.83L17.58,18L14.73,15.17L16.15,13.76L19,16.57L21.8,13.76L23.22,15.17L20.41,18L23.22,20.83L21.8,22.24L19,19.4L16.15,22.24L14.73,20.83M13,19.88C13.04,20.18 12.94,20.5 12.71,20.71C12.32,21.1 11.69,21.1 11.3,20.71L7.29,16.7C7.06,16.47 6.96,16.16 7,15.87V10.75L2.21,4.62C1.87,4.19 1.95,3.56 2.38,3.22C2.57,3.08 2.78,3 3,3V3H17V3C17.22,3 17.43,3.08 17.62,3.22C18.05,3.56 18.13,4.19 17.79,4.62L13,10.75V19.88M5.04,5L9,10.06V15.58L11,17.58V10.05L14.96,5H5.04Z"
        />
      </svg>
      <p class="subtitle-1">{{ $t('No results found') }}</p>
      <p class="subtitle-2">
        {{ $t('Try changing the search terms in the filter') }}
      </p>
      <v-btn depressed color="primary" @click="onClean(filters)">
        {{ $t('Clear filters') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      default: {}
    }
  },
  computed: {
    drawer() {
      return this.$store.state.sidebar;
    }
  },

  methods: {
    onClean: function (object) {
      for (let key in object) {
        object[key] = null;
      }
    }
  }
};
</script>

<style scoped>
.filter-card {
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
