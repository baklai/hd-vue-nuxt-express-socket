<template>
  <v-tooltip right v-if="$helpdesk.loggedIn">
    <template v-slot:activator="{ on, attrs }">
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        v-on="on"
        v-bind="attrs"
        class="cursor-help"
      >
        <g>
          <path
            :fill="currentColor"
            d="m12.03125,0.06252c6.54843,0 11.90623,5.37187 11.90623,11.93748s-5.3578,11.93748 -11.90623,11.93748s-11.90623,-5.37187 -11.90623,-11.93748s5.3578,-11.93748 11.90623,-11.93748m0,2.3875c-5.26255,0 -9.52498,4.27362 -9.52498,9.54998s4.26243,9.54998 9.52498,9.54998s9.52498,-4.27362 9.52498,-9.54998s-4.26243,-9.54998 -9.52498,-9.54998m-7.14374,3.58124"
          />
          <text
            font-weight="bold"
            xml:space="preserve"
            text-anchor="start"
            font-size="12"
            y="16"
            x="5"
            stroke-width="0"
            :stroke="currentColor"
            :fill="currentColor"
          >
            {{ timeout }}
          </text>
        </g>
      </svg>
    </template>
    <span> {{ $t('Time out') }} ~ {{ timeout }} {{ $t('minutes') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  data() {
    return {
      timeout: 15,
      timerId: null
    };
  },

  created() {
    this.$helpdesk.socket.on('helpdesk:timeout', (payload) => {
      this.timeout = payload;
    });

    this.timerId = setInterval(() => {
      this.timeout--;
      if (this.timeout === 0) {
        clearInterval(this.timerId);
        this.$helpdesk.socket.close();
      }
    }, 60000);
  },

  computed: {
    currentColor() {
      return this.$vuetify.theme.dark ? '#ffffff' : '#757575';
    }
  }
};
</script>

<style>
.cursor-help {
  cursor: help !important;
}
</style>
