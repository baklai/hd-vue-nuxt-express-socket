<template>
  <v-badge overlap color="info" :content="timeout" v-if="$helpdesk.loggedIn">
    <v-icon> {{ timeout % 2 === 0 ? 'mdi-timer-sand' : 'mdi-timer-sand-complete' }} </v-icon>
  </v-badge>
</template>

<script>
export default {
  data() {
    return {
      timeout: 60,
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
  }
};
</script>
