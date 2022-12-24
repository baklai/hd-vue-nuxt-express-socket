<template>
  <v-menu
    left
    bottom
    offset-y
    open-on-hover
    min-width="250"
    v-model="menu"
    v-if="$helpdesk.loggedIn"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon class="mx-2" v-bind="attrs" v-on="{ ...tooltip, ...menu }">
            <v-badge overlap color="info" :content="users.length" v-if="users.length">
              <v-icon> mdi-account-multiple-outline </v-icon>
            </v-badge>
            <v-icon v-else> mdi-account-multiple-outline </v-icon>
          </v-btn>
        </template>
        <span> {{ $t('Online users') }} </span>
      </v-tooltip>
    </template>
    <v-list flat subheader two-line>
      <v-subheader inset class="text-uppercase"> {{ $t('Online users') }} </v-subheader>
      <v-list-item v-for="user in users" :key="user.id" @click="sendMessage(user.id)">
        <v-list-item-avatar class="mb-0 mt-0">
          <v-icon> mdi-account-outline </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: false
    };
  },
  computed: {
    users() {
      return this.$store.state.users;
    }
  },
  methods: {
    sendMessage(id) {
      console.log(`Send message to ${id}`);
    }
  }
};
</script>
