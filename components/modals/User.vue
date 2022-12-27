<template>
  <v-dialog eager persistent scrollable v-model="dialog" max-width="600" overlay-color="#525252">
    <v-card>
      <v-card-title class="pt-0">
        <v-list flat>
          <v-list-item two-line class="pa-0">
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-account-circle-outline </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('User accounts') }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ IDItem ? this.$t('Edit current account') : this.$t('Create new account') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" @click="onClose">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Close') }} </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="onSave">
          <v-row>
            <v-col cols="12">
              <v-card flat class="mx-auto">
                <v-card-text>
                  <v-text-field
                    dense
                    outlined
                    clearable
                    :label="$t('User login')"
                    :rules="rules.require"
                    v-model.trim="user.login"
                    prepend-inner-icon="mdi-account-outline"
                  />

                  <v-text-field
                    dense
                    outlined
                    clearable
                    type="email"
                    :label="$t('User email')"
                    v-model.trim="user.email"
                    prepend-inner-icon="mdi-email-outline"
                  />

                  <v-text-field
                    dense
                    outlined
                    clearable
                    :label="$t('User phone')"
                    v-model.trim="user.phone"
                    prepend-inner-icon="mdi-phone-outline"
                  />

                  <v-text-field
                    dense
                    outlined
                    clearable
                    :label="$t('User name')"
                    :rules="rules.require"
                    v-model.trim="user.name"
                    prepend-inner-icon="mdi-account-circle-outline"
                  />

                  <v-text-field
                    dense
                    outlined
                    clearable
                    :label="$t('User password')"
                    prepend-inner-icon="mdi-lock-outline"
                    :type="eyepass ? 'text' : 'password'"
                    :rules="!IDItem ? rules.password : []"
                    v-model.trim="user.password"
                    :counter="21"
                    :append-icon="eyepass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                    @click:append="eyepass = !eyepass"
                  />

                  <v-switch
                    flat
                    inset
                    dense
                    color="success"
                    :label="$t('Activated account')"
                    v-model="user.isActive"
                  />

                  <v-switch
                    flat
                    inset
                    dense
                    color="success"
                    :label="$t('Admin account')"
                    v-model="user.isAdmin"
                  />
                </v-card-text>
              </v-card>
              <v-card class="mx-auto mx-4" flat>
                <v-data-table
                  dense
                  item-key="scope"
                  show-select
                  fixed-header
                  disable-pagination
                  hide-default-footer
                  v-model="user.scope"
                  :headers="headers"
                  :items="$helpdesk.scopes"
                  :height="300"
                  :selected="user.scope.scope"
                  :loading-text="$t('Loading please wait')"
                  :no-data-text="$t('No matching records found')"
                  class="pa-4"
                >
                  <template v-slot:top>
                    <v-app-bar dense flat class="pa-0">
                      <v-icon left>
                        {{
                          user.scope.length
                            ? 'mdi-account-lock-open-outline'
                            : 'mdi-account-lock-outline'
                        }}
                      </v-icon>
                      <v-toolbar-title>
                        {{ $t('Scope list') }}
                        ({{ user.scope.length }}/{{ $helpdesk.scopes.length }})
                      </v-toolbar-title>
                      <v-spacer />
                      <v-responsive max-width="200">
                        <CustomFilterInput v-model="filters.scope" :label="$t('Search in scope')" />
                      </v-responsive>
                    </v-app-bar>
                  </template>

                  <template v-slot:[`item.scope`]="{ item }">
                    <v-chip label small>
                      {{ item.scope }}
                    </v-chip>
                  </template>
                  <template v-slot:[`item.comment`]="{ item }">
                    <span class="body-2">
                      {{ item.comment }}
                    </span>
                  </template>
                </v-data-table>
                <v-divider />
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="onClose"> {{ $t('Cancel') }} </v-btn>
        <v-btn text @click="onSave"> {{ $t('Save') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      eyepass: false,
      dialog: false,
      IDItem: null,

      filters: {
        scope: ''
      },

      user: {
        name: null,
        email: null,
        phone: null,
        login: null,
        password: null,
        isActive: false,
        isAdmin: false,
        scope: []
      },

      rules: {
        require: [(v) => !!v || this.$t('Field is required')],
        email: [
          (v) => !!v || this.$t('Field is required'),
          (v) =>
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            this.$t('E-mail must be valid')
        ],
        password: [
          (v) => !!v || this.$t('Field is required'),
          (v) =>
            (v && v.length >= 4 && v.length <= 21) ||
            this.$t('Password must be equal or more than 4 characters')
        ]
      },

      selected: []
    };
  },

  computed: {
    headers() {
      return [
        {
          text: this.$t('Scope key'),
          value: 'scope',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true
        },
        {
          text: this.$t('Comment scope'),
          value: 'comment',
          align: 'start',
          width: '180px',
          filterable: true,
          sortable: true
        }
      ];
    }
  },

  methods: {
    async onItem(id) {
      this.IDItem = id;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      try {
        if (this.IDItem) {
          const { name, email, phone, login, isActive, isAdmin, scope } =
            await this.$store.dispatch('api/user/findOne', this.IDItem);
          this.user.name = name;
          this.user.email = email;
          this.user.phone = phone;
          this.user.login = login;
          this.user.isActive = isActive;
          this.user.isAdmin = isAdmin;
          this.user.scope = this.$helpdesk.scopes.filter((item) => scope.includes(item.scope));
        }
        this.dialog = true;
      } catch (err) {
        this.$toast.error(err.message);
        this.onClose();
      }
    },

    async onSave() {
      if (this.$refs.form.validate()) {
        try {
          if (this.IDItem) {
            await this.$store.dispatch('api/user/updateOne', {
              id: this.IDItem,
              ...this.user,
              scope: this.user.scope.map((item) => item.scope)
            });
            this.$toast.success(this.$t('Record is updated'));
          } else {
            await this.$store.dispatch('api/user/createOne', {
              ...this.user,
              scope: this.user.scope.map((item) => item.scope)
            });
            this.$toast.success(this.$t('Record is created'));
          }
          this.onClose();
        } catch (err) {
          this.$toast.error(err.message);
        }
      } else {
        this.$toast.error(this.$t('Fill in all required fields'));
      }
    },

    onClose() {
      this.dialog = false;
      this.IDItem = null;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.$emit('closeEvent');
    }
  }
};
</script>
