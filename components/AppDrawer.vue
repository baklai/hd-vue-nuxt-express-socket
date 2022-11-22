<template>
  <v-navigation-drawer
    app
    width="320"
    v-model="drawer"
    v-if="$auth.loggedIn"
    :mini-variant="!drawer"
    fixed
    hide-overlay
    permanent
  >
    <AppDrawerMini :app="false" :absolute="true" />
    <template v-slot:prepend>
      <v-sheet height="128" width="100%" v-show="drawer">
        <v-list three-line class="pl-14">
          <v-list-item>
            <v-list-item-avatar tile>
              <v-icon large> {{ apppage.appicon }} </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="body-1 text-uppercase font-weight-bold">
                {{ $t(apppage.apptitle) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t(apppage.appsubtitle) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </template>

    <v-list two-line flat class="pl-14" v-show="drawer">
      <v-list-item-group>
        <v-list-item link :to="$helpdesk.home.path" class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon> {{ $helpdesk.home.appicon }} </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t($helpdesk.home.apptitle) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t($helpdesk.home.appsubtitle) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="$helpdesk.blog.path" class="pl-2">
          <v-list-item-avatar class="mr-2">
            <v-icon> {{ $helpdesk.blog.appicon }} </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t($helpdesk.blog.apptitle) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t($helpdesk.blog.appsubtitle) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list flat two-line subheader class="pl-14" v-show="drawer" v-if="$hasScope('apps')">
      <v-subheader> {{ $t('Applications') }} </v-subheader>
      <v-list-item-group v-for="(item, i) in $helpdesk.apps.children" :key="i">
        <v-list-item
          v-if="!item.children && $hasScope(item.scope)"
          link
          :to="item.path"
          class="pl-2"
        >
          <v-list-item-avatar class="mr-2">
            <v-icon> {{ item.appicon }} </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ $t(item.apptitle) }} </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t(item.appsubtitle) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-group color="none" v-if="item.children && $hasScope(item.scope)">
          <template v-slot:activator>
            <v-list-item-avatar class="mr-2">
              <v-icon> {{ item.appicon }} </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title> {{ $t(item.apptitle) }} </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t(item.appsubtitle) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <v-list flat>
            <v-list-item link exact v-for="(item, i) in item.children" :key="i" :to="item.path">
              <v-list-item-avatar class="my-0 mr-0 ml-9">
                <v-icon> {{ item.appicon }} </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title> {{ $t(item.apptitle) }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list-group>
      </v-list-item-group>
    </v-list>
    <v-list subheader two-line flat class="pl-14" v-show="drawer" v-if="$auth.user.isAdmin">
      <v-subheader> {{ $t('Administration') }} </v-subheader>
      <v-list-item-group mandatory>
        <v-list-item
          link
          v-for="(item, i) in $helpdesk.core.children"
          :key="i"
          :to="item.path"
          class="pl-2"
        >
          <v-list-item-avatar class="mr-2">
            <v-icon> {{ item.appicon }} </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ $t(item.apptitle) }} </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t(item.appsubtitle) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    app: {
      type: Boolean,
      default: true
    },
    absolute: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    },

    drawer: {
      get() {
        return this.$store.state.sidebar;
      },
      set(val) {
        this.$store.commit('sidebar', val);
      }
    }
  }
};
</script>

<style scoped>
.v-list-group :deep(.v-list-item) {
  padding: 0 8px !important;
}

.v-list-group :deep(.v-list-item__icon) {
  margin-left: 0px !important;
}

.v-list--two-line :deep(.v-list-item),
.v-list-item--two-line {
  min-height: 54px !important;
}
</style>
