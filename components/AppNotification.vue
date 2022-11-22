<template>
  <v-menu offset-y max-width="400" v-model="menu" v-if="$auth.loggedIn">
    <template v-slot:activator="{}">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-on="on" v-bind="attrs" class="mx-2" @click.prevent="menu = !menu">
            <v-badge
              overlap
              color="red"
              :content="notifications.length"
              v-if="notifications.length"
            >
              <v-icon> mdi-bell-outline </v-icon>
            </v-badge>
            <v-icon v-else> mdi-bell-outline </v-icon>
          </v-btn>
        </template>
        <span> {{ $t('Notifications') }} </span>
      </v-tooltip>
    </template>
    <v-card v-if="notifications.length">
      <v-list dense two-line min-width="400" max-height="600">
        <v-list-item v-for="(item, index) in notifications" :key="index">
          <v-list-item-avatar>
            <v-icon> mdi-bell-ring-outline </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1 mb-2">{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle class="subtitle-2" v-html="item.text"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="delNotification(item.id)">
              <v-icon small> mdi-close-circle-outline </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      notifications: []
    };
  },
  async mounted() {
    await this.getNotifications();
  },
  methods: {
    async getNotifications() {
      this.notifications = await this.$store.dispatch('api/notification/findAll');
    },

    async delNotification(id) {
      await this.$store.dispatch('api/notification/removeOne', id);
      await this.getNotifications();
      this.$toast.success(this.$t('Notification is close'));
    }
  }
};
</script>
