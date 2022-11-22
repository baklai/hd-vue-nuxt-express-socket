<template>
  <v-container fill-height fluid>
    <v-row align="center" no-gutters justify="space-around">
      <v-col cols="10" class="d-flex justify-center">
        <v-card flat outlined max-width="800" min-width="auto" width="800">
          <v-window v-model="tab" vertical>
            <v-window-item :value="1">
              <v-row class="ma-0">
                <v-col cols="12" md="6">
                  <v-card-title class="justify-center align-center mb-2">
                    <AppLogoImg :origin="true" class="mx-4" />
                  </v-card-title>
                  <v-card-text>
                    <h4 class="text-center grey--text">
                      {{ $t(app.description) }}
                    </h4>
                    <AppCopyright class="my-4" />
                  </v-card-text>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="rounded-bl-xl"
                  :class="$vuetify.theme.dark ? 'bg-light' : 'bg-dark'"
                >
                  <v-card-title class="justify-center align-center mt-4">
                    <v-img max-height="100" max-width="100" src="/img/helpdesk-user.svg" />
                  </v-card-title>
                  <v-card-text class="justify-center text-center align-center mb-2">
                    <h2
                      class="text-center mb-2"
                      :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
                    >
                      {{ $auth.loggedIn ? $auth.user.name : `${$t('Alredy Signed up')}?` }}
                    </h2>
                    <p
                      class="text-center mb-2"
                      :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
                      v-if="$auth.loggedIn"
                    >
                      {{ $auth.user.email }}
                    </p>
                    <h5 class="text-center grey--text">
                      {{
                        $auth.loggedIn
                          ? $t('Welcome to the app')
                          : $t('Sign in to your account to continue creating and editing data')
                      }}
                    </h5>
                  </v-card-text>
                  <v-card-actions class="justify-center text-center align-center mb-2">
                    <v-btn
                      tile
                      dark
                      color="#00a2e9"
                      class="px-4"
                      @click="tab++"
                      v-if="!$auth.loggedIn"
                    >
                      <v-icon small left> mdi-login-variant </v-icon> {{ $t('Signin') }}
                    </v-btn>
                    <v-btn
                      tile
                      dark
                      color="#00a2e9"
                      class="px-4"
                      @click="Logout()"
                      v-if="$auth.loggedIn"
                    >
                      <v-icon small left> mdi-logout-variant </v-icon> {{ $t('Signout') }}
                    </v-btn>
                  </v-card-actions>

                  <div class="text-center"></div>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item :value="2" v-if="!$auth.loggedIn">
              <v-row class="ma-0">
                <v-col
                  cols="12"
                  md="6"
                  class="rounded-br-xl"
                  :class="$vuetify.theme.dark ? 'bg-light' : 'bg-dark'"
                  @click="tab--"
                >
                  <v-card-title class="justify-center align-center mb-2">
                    <AppLogoImg :origin="true" class="mx-4" />
                  </v-card-title>
                  <v-card-text>
                    <h4 class="text-center grey--text">
                      {{ $t(app.description) }}
                    </h4>
                    <AppCopyright :reverse="true" class="my-4" />
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="6" class="pa-0 py-2">
                  <v-card-title class="justify-center">
                    <h2 class="text-center">{{ $t('Sign in application') }}</h2>
                  </v-card-title>
                  <v-card-text class="mt-2">
                    <h5 class="text-center grey--text">
                      {{ $t('Login in to Your Account') }} <br />
                    </h5>
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="10">
                        <v-form
                          ref="loginForm"
                          class="my-6"
                          lazy-validation
                          @submit.prevent="onSignin"
                        >
                          <v-text-field
                            dense
                            outlined
                            clearable
                            type="text"
                            name="login"
                            :label="$t('Login')"
                            prepend-inner-icon="mdi-account-circle-outline"
                            color="blue darken-1"
                            v-model.trim="login"
                            :rules="rules.login"
                            @keypress.enter="onSignin"
                            class="mb-2"
                          />
                          <v-text-field
                            dense
                            outlined
                            clearable
                            name="password"
                            :label="$t('Password')"
                            prepend-inner-icon="mdi-lock-outline"
                            color="blue darken-1"
                            :type="showeye ? 'text' : 'password'"
                            :append-icon="showeye ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            :counter="21"
                            v-model.trim="password"
                            :rules="rules.password"
                            @click:append="showeye = !showeye"
                            @click:append-outer="onSignin"
                            @keypress.enter="onSignin"
                          />
                          <h5 class="text-center grey--text">
                            {{
                              $t('Please enter your login and password to sign in the application')
                            }}
                          </h5>
                        </v-form>
                        <v-btn color="blue" dark block tile @click="onSignin">
                          <v-icon small left> mdi-login-variant </v-icon>
                          {{ $t('Signin') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-home-outline',
    apptitle: 'Helpdesk service',
    appsubtitle: 'Helpdesk of the technical support department'
  },

  layout({ $auth }) {
    return $auth.loggedIn ? 'apps' : 'default';
  },

  data() {
    return {
      tab: 1,

      login: '',
      password: '',
      rules: {
        login: [(v) => !!v || this.$t('Login is required')],
        password: [
          (v) => !!v || this.$t('Password is required'),
          (v) =>
            (v && v.length >= 4 && v.length <= 21) ||
            this.$t('Password must be equal or more than 4 characters')
        ]
      },
      showeye: false
    };
  },

  computed: {
    app() {
      return this.$store.state.app;
    },

    classObject() {
      return {
        'bg-dark': !this.$vuetify.theme.dark,
        'bg-light': this.$vuetify.theme.dark
      };
    }
  },

  methods: {
    async onSignin() {
      if (this.$refs.loginForm.validate()) {
        try {
          const user = {
            login: this.login,
            password: this.password
          };
          await this.$auth.loginWith('local', {
            data: { ...user }
          });
          this.$toast.success(this.$t('Authorization passed'));
        } catch (err) {
          this.$toast.error(this.$t(err.response.data.message));
        }
      }
    },

    async Logout() {
      this.$toast.success(this.$t('Logout successfully completed'));
      await this.$auth.logout('local');
    }
  }
};
</script>

<style scoped>
.bg-light {
  background-color: #fff;
}
.bg-dark {
  background-color: #333;
}
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 200px !important;
}
.v-application .rounded-br-xl {
  border-bottom-right-radius: 200px !important;
}
</style>
