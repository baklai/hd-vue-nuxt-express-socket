<template>
  <v-dialog persistent scrollable v-model="dialog" width="600" overlay-color="#525252">
    <v-card>
      <v-card-title class="pt-0">
        <v-list flat>
          <v-list-item two-line class="pa-0">
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-book-open-outline </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('Status request') }} :
                {{ item.closed ? $t('Request closed') : $t('Request opened') }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ status }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" @click="close">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Close') }} </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="save()">
          <v-card flat class="my-2">
            <v-card-text>
              <v-card-subtitle>
                <strong> {{ $t('Client request') }} </strong>
              </v-card-subtitle>
              <v-textarea
                dense
                outlined
                :rules="rules.require"
                v-model="item.request"
                rows="4"
                type="text"
                :label="$t('Client request')"
                prepend-inner-icon="mdi-text-box-outline"
              />

              <v-card-subtitle>
                <strong> {{ $t('Client info') }} </strong>
              </v-card-subtitle>

              <v-text-field
                dense
                outlined
                clearable
                :rules="rules.require"
                v-model="item.fullname"
                type="text"
                :label="$t('Client name')"
                prepend-inner-icon="mdi-account-outline"
              />

              <v-text-field
                dense
                outlined
                clearable
                :rules="rules.require"
                v-model="item.phone"
                type="text"
                :label="$t('Client phone')"
                prepend-inner-icon="mdi-phone-outline"
              />

              <v-autocomplete
                dense
                outlined
                clearable
                item-text="title"
                item-value="id"
                :items="positions"
                :rules="rules.require"
                v-model="item.position"
                :label="$t('Client position')"
                prepend-inner-icon="mdi-briefcase-account-outline"
              />

              <v-text-field
                dense
                outlined
                clearable
                v-model="item.ipaddress"
                type="text"
                :label="$t('Client IP Address')"
                prepend-inner-icon="mdi-ip-network-outline"
              />

              <v-text-field
                dense
                outlined
                clearable
                v-model="item.mail"
                type="text"
                :label="$t('Client mail number')"
                prepend-inner-icon="mdi-email-outline"
              />

              <v-autocomplete
                dense
                outlined
                clearable
                item-text="title"
                item-value="id"
                :items="locations"
                :rules="rules.require"
                v-model="item.location"
                :label="$t('Client location')"
                prepend-inner-icon="mdi-map-marker-outline"
              />

              <v-card-subtitle>
                <strong> {{ $t('Company') }} </strong>
              </v-card-subtitle>

              <v-autocomplete
                dense
                outlined
                clearable
                item-text="title"
                item-value="id"
                :items="companies"
                :rules="rules.require"
                v-model="item.company"
                :label="$t('Client company')"
                prepend-inner-icon="mdi-office-building-outline"
              />

              <v-autocomplete
                dense
                outlined
                clearable
                item-text="title"
                item-value="id"
                :items="branches"
                :rules="rules.require"
                v-model="item.branch"
                :label="$t('Client branch')"
                prepend-inner-icon=" "
              />

              <v-autocomplete
                dense
                outlined
                clearable
                item-text="title"
                item-value="id"
                :items="enterprises"
                :rules="rules.require"
                v-model="item.enterprise"
                :label="$t('Client enterprise')"
                prepend-inner-icon=" "
              />

              <v-autocomplete
                dense
                outlined
                clearable
                item-text="title"
                item-value="id"
                :items="departments"
                :rules="rules.require"
                v-model="item.department"
                :label="$t('Client department')"
                prepend-inner-icon=" "
              />

              <v-card-subtitle>
                <strong> {{ $t('Closed request') }} </strong>
              </v-card-subtitle>

              <CustomDateTimePicker v-model="item.closed" :label="$t('Date close request')" />

              <v-textarea
                dense
                outlined
                clearable
                v-model="item.conclusion"
                rows="5"
                type="text"
                :label="$t('Conclusion for request')"
                prepend-inner-icon="mdi-text-box-check-outline"
              />

              <v-textarea
                dense
                outlined
                v-model="item.comment"
                rows="3"
                type="text"
                :label="$t('Comment')"
                prepend-inner-icon="mdi-comment-text-outline"
              />
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close"> {{ $t('Cancel') }} </v-btn>
        <v-btn text @click="save"> {{ $t('Save') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      status: false,
      IDItem: null,

      locations: [],
      companies: [],
      branches: [],
      enterprises: [],
      departments: [],
      positions: [],

      item: {
        fullname: null,
        phone: null,
        position: null,
        ipaddress: null,
        mail: null,
        location: null,
        company: null,
        branch: null,
        enterprise: null,
        department: null,
        request: null,
        closed: null,
        comment: null,
        conclusion: null
      },

      rules: {
        require: [(v) => !!v || this.$t('Field is required')]
      }
    };
  },

  watch: {
    IDItem: {
      handler: function (value) {
        this.status = value ? this.$t('Edit current record') : this.$t('Create new record');
      },
      deep: true
    }
  },

  computed: {
    title() {
      return this.$t('Operational journal');
    }
  },

  methods: {
    async onItem(id) {
      this.IDItem = id;
      try {
        this.status = this.IDItem ? this.$t('Edit current record') : this.$t('Create new record');

        this.companies = await this.$store.dispatch('api/company/findAll');
        this.branches = await this.$store.dispatch('api/branch/findAll');
        this.enterprises = await this.$store.dispatch('api/enterprise/findAll');
        this.departments = await this.$store.dispatch('api/department/findAll');
        this.locations = await this.$store.dispatch('api/location/findAll');
        this.positions = await this.$store.dispatch('api/position/findAll');

        if (this.IDItem) {
          const data = await this.$store.dispatch('api/request/findOne', this.IDItem);
          this.item.fullname = data.fullname;
          this.item.phone = data.phone;
          data.position ? (this.item.position = data.position.id) : (this.item.position = null);
          this.item.ipaddress = data.ipaddress;
          this.item.mail = data.mail;
          data.location ? (this.item.location = data.location.id) : (this.item.location = null);
          data.company ? (this.item.company = data.company.id) : (this.item.company = null);
          data.branch ? (this.item.branch = data.branch.id) : (this.item.branch = null);
          data.enterprise
            ? (this.item.enterprise = data.enterprise.id)
            : (this.item.enterprise = null);
          data.department
            ? (this.item.department = data.department.id)
            : (this.item.department = null);
          this.item.fullname = data.fullname;

          this.item.request = data.request;
          this.item.closed = data.closed;
          this.item.comment = data.comment;
          this.item.conclusion = data.conclusion;
        }
        this.dialog = true;
      } catch (err) {
        console.error(err);
        this.$toast.error(err.message);
        this.close();
      }
    },

    async save() {
      if (this.$refs.form.validate()) {
        try {
          if (this.IDItem) {
            await this.$store.dispatch('api/request/updateOne', {
              id: this.IDItem,

              fullname: this.item.fullname,
              phone: this.item.phone,
              position: this.item.position,
              ipaddress: this.item.ipaddress,
              mail: this.item.mail,
              location: this.item.location,
              company: this.item.company,
              branch: this.item.branch,
              enterprise: this.item.enterprise,
              department: this.item.department,
              request: this.item.request,
              closed: this.item.closed,
              comment: this.item.comment,
              conclusion: this.item.conclusion,
              workerClose: this.item.closed ? this.$helpdesk.user.id : null
            });
            this.$toast.success(this.$t('Record is updated'));
          } else {
            await this.$store.dispatch('api/request/createOne', {
              workerOpen: this.$helpdesk.user.id,
              fullname: this.item.fullname,
              phone: this.item.phone,
              position: this.item.position,
              ipaddress: this.item.ipaddress,
              mail: this.item.mail,
              location: this.item.location,
              company: this.item.company,
              branch: this.item.branch,
              enterprise: this.item.enterprise,
              department: this.item.department,
              request: this.item.request,
              closed: this.item.closed,
              comment: this.item.comment,
              conclusion: this.item.conclusion,
              workerClose: this.item.closed ? this.$helpdesk.user.id : null
            });
            this.$toast.success(this.$t('Record is created'));
          }
          this.close();
        } catch (err) {
          console.error(err);
          this.$toast.error(err.message);
        }
      } else {
        this.$toast.error(this.$t('Fill in all required fields'));
      }
    },

    close() {
      this.dialog = false;
      this.IDItem = null;
      this.$emit('closeEvent');
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style>
.icon-small .v-icon {
  font-size: 18px !important;
}
</style>
