<template>
  <v-container full-height fluid>
    <v-row class="fill-height">
      <v-col cols="12" md="4">
        <v-card class="ma-2" flat outlined tile>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon left> mdi-bell-outline </v-icon>
              <span> {{ $t('Notification') }} </span>
              <v-spacer />
            </v-toolbar-title>
            <v-spacer />
            <v-btn small outlined @click="sendNotification">
              {{ $t('Send') }}
            </v-btn>
          </v-toolbar>
          <v-card-text class="my-4">
            <v-form ref="form" lazy-validation @submit.prevent="sendNotification">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    dense
                    clearable
                    type="text"
                    label="Title"
                    :rules="rules.require"
                    v-model.trim="title"
                    prepend-icon="mdi-format-title"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    dense
                    clearable
                    rows="3"
                    label="Text"
                    :rules="rules.require"
                    v-model.trim="text"
                    prepend-icon="mdi-comment-text-outline"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    flat
                    dense
                    chips
                    multiple
                    clearable
                    small-chips
                    hide-selected
                    deletable-chips
                    persistent-hint
                    hide-spin-buttons
                    v-model="selectedUsers"
                    :items="users"
                    item-value="id"
                    item-text="name"
                    prepend-icon="mdi-account-multiple-check-outline"
                    :label="$t('List of user accounts')"
                    :hint="$t('Specify users to create a notification')"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item ripple @mousedown.prevent @click="toggleSelectUser">
                        <v-list-item-action>
                          <v-icon> {{ icon }} </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ $t('Select all') }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2" />
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4"> </v-col>
      <v-col cols="12" md="4"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-cog-outline',
    apptitle: 'Configuration',
    appsubtitle: 'Configuration of the helpdesk service'
  },

  async asyncData({ store }) {
    const users = await store.dispatch('api/user/findAll');
    return { users };
  },

  data() {
    return {
      title: '',
      text: '',
      selectedUsers: [],
      rules: {
        require: [(v) => !!v || this.$t('Field is required')]
      }
    };
  },
  computed: {
    likesAllUser() {
      return this.selectedUsers.length === this.users.length;
    },
    likesSomeUser() {
      return this.selectedUsers.length > 0 && !this.likesAllUser;
    },
    icon() {
      if (this.likesAllUser) return 'mdi-close-box';
      if (this.likesSomeUser) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outline';
    }
  },
  methods: {
    toggleSelectUser() {
      this.$nextTick(() => {
        if (this.likesAllUser) {
          this.selectedUsers = [];
        } else {
          this.selectedUsers = this.users.map((item) => item.id);
        }
      });
    },
    async sendNotification() {
      if (this.$refs.form.validate()) {
        await this.$store.dispatch('api/notification/createMany', {
          title: this.title,
          text: this.text,
          users: this.selectedUsers
        });
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$toast.success(this.$t('Notification is send'));
      }
    }
  }
};
</script>
