<template>
  <div>
    <v-list-item @click="onPing(host)">
      <v-list-item-icon class="mr-1">
        <v-icon small> mdi-lan-pending </v-icon>
      </v-list-item-icon>
      <v-list-item-title> {{ $t('ICMP Ping') }} </v-list-item-title>
    </v-list-item>
    <v-list-item @click="getRDPClient(host)">
      <v-list-item-icon class="mr-1">
        <v-icon small> mdi-monitor-eye </v-icon>
      </v-list-item-icon>
      <v-list-item-title> {{ $t('RDP Connect') }} </v-list-item-title>
    </v-list-item>
    <v-list-item @click="getVNCClient(host)">
      <v-list-item-icon class="mr-1">
        <v-icon small> mdi-monitor-eye </v-icon>
      </v-list-item-icon>
      <v-list-item-title> {{ $t('VNC Connect') }} </v-list-item-title>
    </v-list-item>
    <v-list-item @click="copyIPtoClipboard(host)">
      <v-list-item-icon class="mr-1">
        <v-icon small> mdi-content-copy </v-icon>
      </v-list-item-icon>
      <v-list-item-title> {{ $t('IP to clipboard') }} </v-list-item-title>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: {
    host: {
      type: String,
      default: null
    }
  },

  computed: {
    IPv4() {
      return this.$store.state.regex.IPv4;
    }
  },

  methods: {
    copyIPtoClipboard(ip) {
      this.$clipboard(ip);
      this.$toast.success(this.$t('IP Copied to clipboard'));
    },

    async getRDPClient(ip) {
      const file = await this.$store.dispatch('api/tool/getRDP', ip);
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RDP_${ip}.rdp`);
      this.$toast.success(this.$t('RDP File created'));
      link.click();
    },

    async getVNCClient(ip) {
      const file = await this.$store.dispatch('api/tool/getVNC', ip);
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VNC_${ip}.vnc`);
      this.$toast.success(this.$t('VNC File created'));
      link.click();
    },

    async onPing(host) {
      try {
        if (this.IPv4.test(host)) {
          this.$toast.info(this.$t('Ping run'));
          const ping = await this.$store.dispatch('api/tool/getOPING', host);
          if (ping) {
            this.$toast.show('<pre>' + ping.output + '</pre>', {
              duration: 10000
            });
          }
        } else {
          this.$toast.error(this.$t('Enter correct target for ping'));
        }
      } catch (err) {
        this.$toast.error(this.$t('Ping error'));
      }
    }
  }
};
</script>
