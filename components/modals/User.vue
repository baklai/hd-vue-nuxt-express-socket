<template>
  <v-dialog eager persistent scrollable v-model="dialog" max-width="900" overlay-color="#525252">
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
                    clearable
                    type="text"
                    :label="$t('User login')"
                    :rules="rules.require"
                    v-model.trim="user.login"
                    prepend-icon="mdi-account-outline"
                  />

                  <v-text-field
                    clearable
                    type="email"
                    :label="$t('User email')"
                    v-model.trim="user.email"
                    prepend-icon="mdi-email-outline"
                  />

                  <v-text-field
                    clearable
                    type="text"
                    :label="$t('User phone')"
                    v-model.trim="user.phone"
                    prepend-icon="mdi-phone-outline"
                  />

                  <v-text-field
                    clearable
                    type="text"
                    :label="$t('User name')"
                    :rules="rules.require"
                    v-model.trim="user.name"
                    prepend-icon="mdi-account-circle-outline"
                  />

                  <v-text-field
                    clearable
                    :label="$t('User password')"
                    prepend-icon="mdi-lock-outline"
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
              <v-card class="mx-auto" flat>
                <v-card-title>
                  <v-icon left>
                    {{
                      user.scope.length
                        ? 'mdi-account-lock-open-outline'
                        : 'mdi-account-lock-outline'
                    }}
                  </v-icon>
                  {{ $t('Scope list') }}
                  <span class="mx-2">
                    ( {{ user.scope.length }} / {{ $helpdesk.scopes.length }} )
                  </span>
                  <v-spacer />

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-on="on" v-bind="attrs" class="mx-2" @click="user.scope = []">
                        <v-icon> mdi-checkbox-multiple-blank-outline </v-icon>
                      </v-btn>
                    </template>
                    <span> {{ $t('Clear all scopes') }} </span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-on="on"
                        v-bind="attrs"
                        @click="user.scope = $helpdesk.scopes.map((item) => item.scope)"
                      >
                        <v-icon> mdi-checkbox-multiple-marked-outline </v-icon>
                      </v-btn>
                    </template>
                    <span> {{ $t('Select all scopes') }} </span>
                  </v-tooltip>
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <table style="width: 100%">
                    <tr>
                      <th>Permission</th>
                      <th>Description</th>
                      <th>Country</th>
                    </tr>
                    <tr v-for="item of $helpdesk.scopes" :key="item.scope">
                      <td>
                        <v-chip x-small label>{{ item.scope }}</v-chip>
                      </td>
                      <td>{{ item.comment }}</td>
                    </tr>
                  </table>
                  <!-- <v-virtual-scroll
                    :items="$helpdesk.scopes"
                    item-height="48"
                    height="400"
                  >
                    <template v-slot:default="{ item }">
                      <v-subheader v-if="!item.scope">
                        <v-spacer />
                        {{ item.comment.toUpperCase() }}
                      </v-subheader>
                      <v-checkbox
                        dense
                        persistent-hint
                        v-model="user.scope"
                        :label="item.comment"
                        :hint="`Score key: ${item.scope}`"
                        :value="item.scope"
                        class="px-2"
                        v-else
                      />
                    </template>
                  </v-virtual-scroll> -->
                </v-card-text>
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
      }
    };
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
          this.user.scope = scope;
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
              ...this.user
            });
            this.$toast.success(this.$t('Record is updated'));
          } else {
            await this.$store.dispatch('api/user/createOne', this.user);
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
