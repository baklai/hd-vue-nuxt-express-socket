<template>
  <v-dialog persistent scrollable v-model="dialog" width="600" overlay-color="#525252">
    <v-card>
      <v-card-title class="pt-0">
        <v-list flat>
          <v-list-item two-line class="pa-0">
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-ip-outline </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ status }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ subtitle }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer />

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" @click="close()">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Close') }} </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="save()">
          <v-card flat class="my-2">
            <v-card-subtitle>
              <strong> {{ $t('Date create') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <CustomDatePicker v-model="item.date" :label="$t('Date create IP Address')" />
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Mail number') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <v-text-field
                dense
                outlined
                clearable
                v-model="item.mail"
                type="text"
                :label="$t('Client mail number')"
                prepend-inner-icon="mdi-email-outline"
              />
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('IP Address') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <v-text-field
                dense
                outlined
                clearable
                :rules="rules.ipv4"
                v-model="item.ipaddress"
                type="text"
                :label="$t('Client IP Address')"
                prepend-inner-icon="mdi-ip-outline"
              />
              <v-autocomplete
                dense
                outlined
                clearable
                return-object
                :items="cidrs"
                :rules="rules.require"
                v-model="item.cidr"
                :item-text="(item) => `${item.mask} / ${item.value}`"
                :label="$t('Mask IP Address')"
                prepend-inner-icon=" "
              />
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Unit') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <v-autocomplete
                dense
                outlined
                clearable
                item-text="title"
                item-value="id"
                :items="units"
                :rules="rules.require"
                v-model="item.unit"
                :label="$t('Client unit')"
                prepend-inner-icon="mdi-expansion-card-variant"
              />
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Location') }} </strong>
            </v-card-subtitle>
            <v-card-text>
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
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Company') }} </strong>
            </v-card-subtitle>
            <v-card-text>
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
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Client info') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <v-text-field
                dense
                outlined
                clearable
                v-model="item.fullname"
                type="text"
                :label="$t('Client fullname')"
                prepend-inner-icon="mdi-account-circle-outline"
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
                v-model="item.phone"
                type="text"
                :label="$t('Client phone')"
                prepend-inner-icon="mdi-phone-outline"
              />
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Autoanswer') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <v-text-field
                dense
                outlined
                clearable
                v-model="item.autoanswer"
                type="text"
                :label="$t('Client autoanswer')"
                prepend-inner-icon="mdi-swap-horizontal"
              />
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Internet') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <v-text-field
                dense
                outlined
                clearable
                v-model="item.internet_mail"
                type="text"
                :label="$t('Internet mail number')"
                prepend-inner-icon="mdi-email-outline"
              />

              <CustomDatePicker
                v-model="item.internet_dateOpen"
                :label="$t('Date open internet')"
              />

              <CustomDatePicker
                v-model="item.internet_dateClose"
                :label="$t('Date close internet')"
              />

              <v-textarea
                dense
                outlined
                clearable
                rows="1"
                type="text"
                v-model="item.internet_comment"
                :label="$t('Comment')"
                prepend-inner-icon="mdi-text-box-outline"
              />
            </v-card-text>

            <v-card-subtitle>
              <strong> {{ $t('Comment') }} </strong>
            </v-card-subtitle>
            <v-card-text>
              <v-textarea
                dense
                outlined
                clearable
                rows="5"
                type="text"
                v-model="item.comment"
                :label="$t('Comment')"
                prepend-inner-icon="mdi-text-box-outline"
              />
            </v-card-text>

            <v-card-text>
              <v-data-iterator :items="item.email" hide-default-footer>
                <template v-slot:header>
                  <v-card-title class="pa-0">
                    <v-card-subtitle class="px-0">
                      <strong> {{ $t('E-mails') }} </strong>
                    </v-card-subtitle>
                    <v-spacer />
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-on="on" v-bind="attrs" @click="addItem()">
                          <v-icon> mdi-plus-circle-outline </v-icon>
                        </v-btn>
                      </template>
                      <span> {{ $t('Create new record') }} </span>
                    </v-tooltip>
                  </v-card-title>
                </template>

                <template v-slot:default="{ items, isExpanded, expand }">
                  <v-card
                    flat
                    outlined
                    v-for="(item, index) in items"
                    :key="item.login"
                    class="mb-2"
                  >
                    <v-card-title class="pa-0">
                      <v-btn
                        icon
                        small
                        @click="(v) => expand(item, !isExpanded(item))"
                        class="mr-4"
                      >
                        <v-icon>
                          {{
                            isExpanded(item)
                              ? 'mdi-chevron-down-circle-outline'
                              : 'mdi-chevron-up-circle-outline'
                          }}
                        </v-icon>
                      </v-btn>
                      {{ item.login }}
                      <v-spacer />
                      <div v-if="editedIndex === index">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-on="on" v-bind="attrs" @click="closeItem()">
                              <v-icon small> mdi-window-close </v-icon>
                            </v-btn>
                          </template>
                          <span> {{ $t('Close record') }} </span>
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-on="on" v-bind="attrs" @click="saveItem()">
                              <v-icon small> mdi-content-save </v-icon>
                            </v-btn>
                          </template>
                          <span> {{ $t('Save record') }} </span>
                        </v-tooltip>
                      </div>
                      <div v-else>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-on="on" v-bind="attrs" @click="editItem(item)">
                              <v-icon small> mdi-pencil </v-icon>
                            </v-btn>
                          </template>
                          <span> {{ $t('Edit record') }} </span>
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-on="on" v-bind="attrs" @click="deleteItem(item)">
                              <v-icon small> mdi-delete </v-icon>
                            </v-btn>
                          </template>
                          <span> {{ $t('Delete record') }} </span>
                        </v-tooltip>
                      </div>
                    </v-card-title>
                    <v-divider v-if="isExpanded(item)" />
                    <v-list dense v-if="isExpanded(item)">
                      <v-list-item>
                        <v-list-item-content>{{ $t('Login') }}:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-text-field
                            dense
                            outlined
                            single-line
                            hide-details
                            v-model="editedItem.login"
                            v-if="editedIndex === index"
                            class="block"
                            style="width: 200px"
                          />
                          <span v-else>{{ item.login }}</span>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>{{ $t('Mail number') }}:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-text-field
                            dense
                            outlined
                            single-line
                            hide-details
                            v-model="editedItem.mail"
                            v-if="editedIndex === index"
                          />
                          <span v-else> {{ item.mail }} </span>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>{{ $t('Fullname') }}:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-text-field
                            dense
                            outlined
                            single-line
                            hide-details
                            v-model="editedItem.fullname"
                            v-if="editedIndex === index"
                          />
                          <span v-else> {{ item.fullname }} </span>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>{{ $t('Open date') }}:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <CustomDatePicker
                            v-model="editedItem.dateOpen"
                            :label="$t('Date open')"
                            v-if="editedIndex === index"
                          />
                          <span v-else> {{ item.dateOpen }} </span>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>{{ $t('Close date') }}:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <CustomDatePicker
                            v-model="editedItem.dateClose"
                            :label="$t('Date close')"
                            v-if="editedIndex === index"
                          />
                          <span v-else> {{ item.dateClose }} </span>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>{{ $t('Comment') }}:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-text-field
                            dense
                            outlined
                            single-line
                            hide-details
                            v-model="editedItem.comment"
                            v-if="editedIndex === index"
                          />
                          <span v-else> {{ item.comment }} </span>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </template>
              </v-data-iterator>
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
      units: [],
      companies: [],
      branches: [],
      enterprises: [],
      departments: [],
      positions: [],

      cidrs: [
        { value: 32, mask: '255.255.255.255' },
        { value: 31, mask: '255.255.255.254' },
        { value: 30, mask: '255.255.255.252' },
        { value: 29, mask: '255.255.255.248' },
        { value: 28, mask: '255.255.255.240' },
        { value: 27, mask: '255.255.255.224' },
        { value: 26, mask: '255.255.255.192' },
        { value: 25, mask: '255.255.255.128' },
        { value: 24, mask: '255.255.255.0' },
        { value: 23, mask: '255.255.254.0' },
        { value: 22, mask: '255.255.252.0' },
        { value: 21, mask: '255.255.248.0' },
        { value: 20, mask: '255.255.240.0' },
        { value: 19, mask: '255.255.224.0' },
        { value: 18, mask: '255.255.192.0' },
        { value: 17, mask: '255.255.128.0' },
        { value: 16, mask: '255.255.0.0' },
        { value: 15, mask: '255.254.0.0' },
        { value: 14, mask: '255.252.0.0' },
        { value: 13, mask: '255.248.0.0' },
        { value: 12, mask: '255.240.0.0' },
        { value: 11, mask: '255.224.0.0' },
        { value: 10, mask: '255.192.0.0' },
        { value: 9, mask: '255.128.0.0' },
        { value: 8, mask: '255.0.0.0' },
        { value: 7, mask: '254.0.0.0' },
        { value: 6, mask: '252.0.0.0' },
        { value: 5, mask: '248.0.0.0' },
        { value: 4, mask: '240.0.0.0' },
        { value: 3, mask: '224.0.0.0' },
        { value: 2, mask: '192.0.0.0' },
        { value: 1, mask: '128.0.0.0' },
        { value: 0, mask: '0.0.0.0' }
      ],

      item: {
        date: null,
        location: null,
        unit: null,
        ipaddress: null,
        cidr: null,
        company: null,
        branch: null,
        enterprise: null,
        department: null,
        fullname: null,
        position: null,
        phone: null,
        mail: null,
        autoanswer: null,
        comment: null,
        internet_mail: null,
        internet_dateOpen: null,
        internet_dateClose: null,
        internet_comment: null,
        email: []
      },

      rules: {
        require: [(v) => !!v || this.$t('Field is required')],
        ipv4: [
          (v) => (!!v && v === null) || this.IPv4.test(v) || this.$t('Examples: 127.0.0.1 (single)')
        ]
      },

      editedIndex: -1,
      editedItem: {
        login: '',
        mail: '',
        dateOpen: null,
        dateClose: null,
        comment: '',
        fullname: ''
      },
      defaultItem: {
        login: '',
        mail: '',
        dateOpen: null,
        dateClose: null,
        comment: '',
        fullname: ''
      }
    };
  },

  computed: {
    title() {
      return this.$t('IP Address');
    },
    subtitle() {
      return this.$t('IP Address from database');
    },

    IPv4() {
      return this.$store.state.regex.IPv4;
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
      this.editedIndex = -1;
      this.IDItem = id;
      try {
        this.status = this.IDItem ? this.$t('Edit current record') : this.$t('Create new record');

        this.locations = await this.$store.dispatch('api/location/findAll');
        this.units = await this.$store.dispatch('api/unit/findAll');
        this.companies = await this.$store.dispatch('api/company/findAll');
        this.branches = await this.$store.dispatch('api/branch/findAll');
        this.enterprises = await this.$store.dispatch('api/enterprise/findAll');
        this.departments = await this.$store.dispatch('api/department/findAll');
        this.positions = await this.$store.dispatch('api/position/findAll');

        if (this.IDItem) {
          const data = await this.$store.dispatch('api/ipaddress/findOne', this.IDItem);
          this.item.date = data.date;
          data.location ? (this.item.location = data.location.id) : (this.item.location = null);
          data.unit ? (this.item.unit = data.unit.id) : (this.item.unit = null);
          this.item.ipaddress = data.ipaddress;
          this.item.cidr = data.cidr;
          data.company ? (this.item.company = data.company.id) : (this.item.company = null);
          data.branch ? (this.item.branch = data.branch.id) : (this.item.branch = null);
          data.enterprise
            ? (this.item.enterprise = data.enterprise.id)
            : (this.item.enterprise = null);
          data.department
            ? (this.item.department = data.department.id)
            : (this.item.department = null);
          this.item.fullname = data.fullname;
          data.position ? (this.item.position = data.position.id) : (this.item.position = null);
          this.item.phone = data.phone;
          this.item.mail = data.mail;
          this.item.autoanswer = data.autoanswer;
          this.item.comment = data.comment;

          this.item.internet_mail = data.internet.mail;
          this.item.internet_dateOpen = data.internet.dateOpen;
          this.item.internet_dateClose = data.internet.dateClose;
          this.item.internet_comment = data.internet.comment;

          data.email ? (this.item.email = data.email) : (this.item.email = []);
        }
        this.dialog = true;
      } catch (err) {
        this.$toast.error(this.$t(err.message));
        this.close();
      }
    },

    async save() {
      if (this.$refs.form.validate()) {
        try {
          let resp = null;
          if (this.IDItem) {
            resp = await this.$store.dispatch('api/ipaddress/updateOne', {
              id: this.IDItem,

              date: this.item.date,
              location: this.item.location,
              unit: this.item.unit,
              ipaddress: this.item.ipaddress,
              cidr: this.item.cidr,
              company: this.item.company,
              branch: this.item.branch,
              enterprise: this.item.enterprise,
              department: this.item.department,
              fullname: this.item.fullname,
              position: this.item.position,
              phone: this.item.phone,
              mail: this.item.mail,
              autoanswer: this.item.autoanswer,
              comment: this.item.comment,
              internet: {
                mail: this.item.internet_mail,
                dateOpen: this.item.internet_dateOpen,
                dateClose: this.item.internet_dateClose,
                comment: this.item.internet_comment
              },
              email: this.item.email
            });
            if (resp) this.$toast.success(this.$t('Record is updated'));
          } else {
            resp = await this.$store.dispatch('api/ipaddress/createOne', {
              date: this.item.date,
              location: this.item.location,
              unit: this.item.unit,
              ipaddress: this.item.ipaddress,
              cidr: this.item.cidr,
              company: this.item.company,
              branch: this.item.branch,
              enterprise: this.item.enterprise,
              department: this.item.department,
              fullname: this.item.fullname,
              position: this.item.position,
              phone: this.item.phone,
              mail: this.item.mail,
              autoanswer: this.item.autoanswer,
              comment: this.item.comment,
              internet: {
                mail: this.item.internet_mail,
                dateOpen: this.item.internet_dateOpen,
                dateClose: this.item.internet_dateClose,
                comment: this.item.internet_comment
              },
              email: this.item.email
            });
            if (resp) this.$toast.success(this.$t('Record is created'));
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
      this.editedIndex = -1;
      this.IDItem = null;
      this.dialog = false;
      this.$emit('closeEvent');
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },

    editItem(item) {
      this.editedIndex = this.item.email.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    deleteItem(item) {
      const index = this.item.email.indexOf(item);
      confirm(this.$t('Are you sure you want to delete this item')) &&
        this.item.email.splice(index, 1);
    },
    closeItem() {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 500);
    },
    addItem() {
      const addObj = Object.assign({}, this.defaultItem);
      this.editedIndex = this.item.email.length + 1;
      this.item.email.unshift(addObj);
      this.editItem(addObj);
    },
    saveItem() {
      if (this.editedIndex > -1) {
        Object.assign(this.item.email[this.editedIndex], this.editedItem);
      }
      this.closeItem();
    }
  }
};
</script>
