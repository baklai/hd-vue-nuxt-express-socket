<template>
  <v-menu
    left
    bottom
    offset-y
    open-on-hover
    max-width="400"
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
    <v-system-bar color="green">
      <v-spacer />
      <strong class="text-uppercase"> {{ $t('Online users') }} </strong>
      <v-spacer />
    </v-system-bar>
    <v-list flat dense max-height="600" class="py-2">
      <v-list-item dense v-for="(item, index) in users" :key="index">
        <v-list-item-icon class="mr-1">
          <v-icon small left> mdi-account-circle-outline </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> {{ item }} </v-list-item-title>
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
  }
};
</script>
