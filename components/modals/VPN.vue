<template>
  <v-dialog persistent scrollable v-model="dialog" max-width="600" overlay-color="#525252">
    <v-card>
      <v-card-title class="pt-0">
        <v-list flat>
          <v-list-item two-line class="pa-0">
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-security-network </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ status }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer />

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" @click="onClose()">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Close') }} </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" class="px-2" lazy-validation @submit.prevent="onSave()">
          <v-text-field
            clearable
            type="text"
            :rules="rules.require"
            v-model.trim="item.vpn"
            :label="$t('VPN Address')"
          />

          <v-text-field
            clearable
            type="text"
            v-model.trim="item.ipaddress"
            :label="$t('IP Address')"
          />

          <v-text-field
            clearable
            type="text"
            :rules="rules.require"
            v-model.trim="item.login"
            :label="$t('VPN Login')"
          />

          <v-autocomplete
            clearable
            item-text="title"
            item-value="id"
            :items="units"
            :rules="rules.require"
            v-model="item.unit"
            :label="$t('Client unit')"
            prepend-icon="mdi-expansion-card-variant"
          />

          <v-autocomplete
            clearable
            item-text="title"
            item-value="id"
            :items="positions"
            :rules="rules.require"
            v-model="item.position"
            :label="$t('Client position')"
            prepend-icon="mdi-briefcase-account-outline"
          />
          <v-autocomplete
            clearable
            item-text="title"
            item-value="id"
            :items="locations"
            :rules="rules.require"
            v-model="item.location"
            :label="$t('Client location')"
            prepend-icon="mdi-map-marker-outline"
          />
          <v-autocomplete
            clearable
            item-text="title"
            item-value="id"
            :items="companies"
            :rules="rules.require"
            v-model="item.company"
            :label="$t('Client company')"
            prepend-icon="mdi-office-building-outline"
          />
          <v-autocomplete
            clearable
            item-text="title"
            item-value="id"
            :items="branches"
            :rules="rules.require"
            v-model="item.branch"
            :label="$t('Client branch')"
            prepend-icon=" "
          />

          <v-autocomplete
            clearable
            item-text="title"
            item-value="id"
            :items="enterprises"
            :rules="rules.require"
            v-model="item.enterprise"
            :label="$t('Client enterprise')"
            prepend-icon=" "
          />

          <v-autocomplete
            clearable
            item-text="title"
            item-value="id"
            :items="departments"
            :rules="rules.require"
            v-model="item.department"
            :label="$t('Client department')"
            prepend-icon=" "
          />

          <v-text-field
            clearable
            type="text"
            v-model.trim="item.fullname"
            :label="$t('Client fullname')"
          />

          <v-text-field
            clearable
            type="text"
            v-model.trim="item.phone"
            :label="$t('Client phone')"
          />

          <v-text-field clearable type="text" v-model.trim="item.mail" :label="$t('Mail number')" />

          <CustomDateOnlyPicker v-model="item.dateOpen" :label="$t('Date open')" />

          <CustomDateOnlyPicker v-model="item.dateClose" :label="$t('Date close')" />

          <v-text-field
            clearable
            type="text"
            v-model.trim="item.service"
            :label="$t('VPN Service')"
          />

          <v-textarea
            rows="2"
            type="text"
            clearable
            v-model.trim="item.comment"
            :label="$t('Comment')"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="onClose()"> {{ $t('Cancel') }} </v-btn>
        <v-btn text @click="onSave()"> {{ $t('Save') }} </v-btn>
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
      units: [],
      companies: [],
      branches: [],
      enterprises: [],
      departments: [],
      positions: [],

      items: [],
      item: {
        vpn: null,
        ipaddress: null,
        login: null,
        fullname: null,
        phone: null,
        mail: null,
        dateOpen: null,
        dateClose: null,
        service: null,
        comment: null,
        location: null,
        unit: null,
        company: null,
        branch: null,
        enterprise: null,
        department: null,
        position: null
      },

      rules: {
        require: [(v) => !!v || this.$t('Field is required')]
      }
    };
  },

  computed: {
    title() {
      return this.$t('VPN Address');
    }
  },

  watch: {
    IDItem: {
      handler: function (value) {
        this.status = value ? this.$t('Edit current record') : this.$t('Create new record');
      },
      deep: true
    }
  },

  methods: {
    async onItem(id) {
      try {
        this.IDItem = id;
        this.status = this.IDItem ? this.$t('Edit current record') : this.$t('Create new record');

        this.locations = await this.$store.dispatch('api/location/findAll');
        this.units = await this.$store.dispatch('api/unit/findAll');
        this.companies = await this.$store.dispatch('api/company/findAll');
        this.branches = await this.$store.dispatch('api/branch/findAll');
        this.enterprises = await this.$store.dispatch('api/enterprise/findAll');
        this.departments = await this.$store.dispatch('api/department/findAll');
        this.positions = await this.$store.dispatch('api/position/findAll');

        if (this.IDItem) {
          const data = await this.$store.dispatch('api/vpn/findOne', this.IDItem);
          this.item.vpn = data.vpn;
          this.item.ipaddress = data.ipaddress;
          this.item.login = data.login;
          this.item.fullname = data.fullname;
          this.item.phone = data.phone;
          this.item.mail = data.mail;
          this.item.dateOpen = data.dateOpen;
          this.item.dateClose = data.dateClose;
          this.item.service = data.service;
          this.item.comment = data.comment;
          this.item.location = data.location ? data.location.id : null;
          this.item.unit = data.unit ? data.unit.id : null;
          this.item.company = data.company ? data.company.id : null;
          this.item.branch = data.branch ? data.branch.id : null;
          this.item.enterprise = data.enterprise ? data.enterprise.id : null;
          this.item.department = data.department ? data.department.id : null;
          this.item.position = data.position ? data.position.id : null;
        } else {
          this.onClean();
        }
        this.dialog = true;
      } catch (err) {
        console.error(err);
        this.$toast.error(err.message);
      }
    },

    async onSave() {
      if (this.$refs.form.validate()) {
        try {
          if (this.IDItem) {
            await this.$store.dispatch('api/vpn/updateOne', {
              id: this.IDItem,

              ...this.item
            });
            this.IDItem = null;
            this.onClose();
            this.$toast.success(this.$t('Record is updated'));
          } else {
            await this.$store.dispatch('api/vpn/createOne', this.item);
            this.onClose();
            this.$toast.success(this.$t('Record is created'));
          }
        } catch (err) {
          console.error(err);
          this.$toast.error(err.message);
        }
      } else {
        this.$toast.error(this.$t('Fill in all required fields'));
      }
    },

    onClean: function () {
      this.IDItem = null;
      for (let key in this.item) {
        this.item[key] = null;
      }
      this.$nextTick(function () {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      });
    },

    onClose() {
      this.onClean();
      this.dialog = false;
      this.$emit('closeEvent');
    }
  }
};
</script>
