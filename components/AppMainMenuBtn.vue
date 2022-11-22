<template>
  <v-menu
    offset-y
    open-on-hover
    v-model="menu"
    :close-on-content-click="false"
    max-height="600"
    min-width="220"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
            <v-icon large> mdi-apps </v-icon>
          </v-btn>
        </template>
        <span> {{ $t('Main menu') }} </span>
      </v-tooltip>
    </template>
    <v-list flat dense expand>
      <v-list-item three-line v-if="$auth.loggedIn">
        <v-list-item-avatar>
          <v-icon large> mdi-account-circle-outline </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ $auth.user.login }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $auth.user.name }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ $auth.user.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="$auth.loggedIn" class="my-2" />
      <v-list-item link :to="$helpdesk.home.path" @click="menu = false">
        <v-list-item-icon class="mr-4">
          <v-icon> {{ $helpdesk.home.appicon }} </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t($helpdesk.home.apptitle) }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link :to="$helpdesk.blog.path" v-if="$auth.loggedIn" @click="menu = false">
        <v-list-item-icon class="mr-4">
          <v-icon> {{ $helpdesk.blog.appicon }} </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t($helpdesk.blog.apptitle) }}
        </v-list-item-title>
      </v-list-item>
      <v-list-group color="none" v-if="$hasScope('apps')">
        <template v-slot:activator>
          <v-list-item-icon class="mr-4">
            <v-icon> mdi-apps </v-icon>
          </v-list-item-icon>
          <v-list-item-title> {{ $t('Applications') }} </v-list-item-title>
        </template>
        <div v-for="(item, i) in $helpdesk.apps.children" :key="i">
          <v-list-item
            v-if="!item.children && $hasScope(item.scope)"
            link
            :to="item.path"
            class="ml-8"
          >
            <v-list-item-icon class="mr-4">
              <v-icon> {{ item.appicon }} </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> {{ $t(item.apptitle) }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            no-action
            color="none"
            append-icon="$expand"
            class="ml-8"
            v-if="item.children && $hasScope(item.scope)"
          >
            <template v-slot:activator>
              <v-list-item-icon class="mr-4">
                <v-icon> {{ item.appicon }} </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> {{ item.apptitle }} </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              link
              v-for="(item, i) in item.children"
              :key="i"
              :to="item.path"
              @click="menu = false"
              class="pl-10"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small> {{ item.appicon }} </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t(item.apptitle) }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list-group>
      <v-list-group color="none" v-if="$auth.loggedIn && $auth.user.isAdmin">
        <template v-slot:activator>
          <v-list-item-icon class="mr-4">
            <v-icon> mdi-view-dashboard-outline </v-icon>
          </v-list-item-icon>
          <v-list-item-title> {{ $t('Administration') }} </v-list-item-title>
        </template>
        <v-list-item
          link
          v-for="(item, i) in $helpdesk.core.children"
          :key="i"
          :to="item.path"
          @click="menu = false"
          class="ml-8"
        >
          <v-list-item-icon class="mr-4">
            <v-icon> {{ item.appicon }} </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> {{ $t(item.apptitle) }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider inset class="my-1" />
      <v-list-group color="none">
        <template v-slot:activator>
          <v-list-item-icon class="mr-4">
            <v-icon> mdi-translate </v-icon>
          </v-list-item-icon>
          <v-list-item-title> {{ $t('Translations') }} </v-list-item-title>
        </template>
        <v-list-item
          link
          v-for="locale in locales"
          :key="locale.code"
          @click.prevent.stop="toggleLang(locale.code)"
          class="ml-8"
        >
          <v-list-item-icon class="mr-2">
            <v-icon small> mdi-web </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> {{ locale.name }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item link @click.prevent="$store.commit('toggleDarkMode')">
        <v-list-item-icon class="mr-4">
          <v-icon> mdi-theme-light-dark </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> {{ $t('Theme toggle') }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :to="$helpdesk.cloud.path"
        v-if="$auth.loggedIn && $config.fileHosting"
        @click="menu = false"
      >
        <v-list-item-icon class="mr-4">
          <v-icon> {{ $helpdesk.cloud.appicon }} </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t($helpdesk.cloud.apptitle) }}
        </v-list-item-title>
      </v-list-item>
      <v-divider inset class="my-1" />
      <v-list-item link v-if="$auth.loggedIn" @click="Logout()">
        <v-list-item-icon class="mr-4">
          <v-icon> mdi-logout-variant </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> {{ $t('Signout') }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link v-else :to="$helpdesk.home.path">
        <v-list-item-icon class="mr-4">
          <v-icon> mdi-login-variant </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> {{ $t('Signin') }} </v-list-item-title>
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
    locales() {
      return this.$i18n.locales.filter((locale) => locale.code !== this.$i18n.locale);
    }
  },

  methods: {
    async toggleLang(code) {
      await this.$i18n.setLocale(code);
    },

    async Logout() {
      this.$toast.success(this.$t('Logout successfully completed'));
      await this.$auth.logout('local');
    }
  }
};
</script>

<style scoped>
.v-btn--icon {
  height: 48px !important;
  width: 48px !important;
}
</style>
