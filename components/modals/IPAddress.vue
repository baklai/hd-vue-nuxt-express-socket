<template>
  <v-dialog persistent scrollable v-model="dialog" width="50%" overlay-color="#525252">
    <v-card>
      <v-card-title>
        <v-icon large left> mdi-ip-outline </v-icon>
        <span class="text-h5"> {{ title }} </span>
        <v-spacer />
        <v-btn icon @click="close()">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="save()">
          <v-row>
            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-subtitle>
                  <strong> {{ $t('Date create') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <CustomDateOnlyPicker v-model="item.date" :label="$t('Date create IP Address')" />
                </v-card-text>

                <v-card-subtitle>
                  <strong> {{ $t('Location') }} </strong>
                </v-card-subtitle>
                <v-card-text>
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
                </v-card-text>

                <v-card-subtitle>
                  <strong> {{ $t('Unit') }} </strong>
                </v-card-subtitle>
                <v-card-text>
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
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-subtitle>
                  <strong> {{ $t('IP Address') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    clearable
                    :rules="rules.ipv4"
                    v-model="item.ipaddress"
                    type="text"
                    :label="$t('Client IP Address')"
                    prepend-icon="mdi-ip-outline"
                  />
                  <v-autocomplete
                    clearable
                    return-object
                    :items="cidrs"
                    :rules="rules.require"
                    v-model="item.cidr"
                    :item-text="(item) => `${item.mask} / ${item.value}`"
                    :label="$t('Mask IP Address')"
                    prepend-icon=" "
                  />
                </v-card-text>

                <v-card-subtitle>
                  <strong> {{ $t('Autoanswer') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    clearable
                    v-model="item.autoanswer"
                    type="text"
                    :label="$t('Client autoanswer')"
                    prepend-icon="mdi-swap-horizontal"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-subtitle>
                  <strong> {{ $t('Company') }} </strong>
                </v-card-subtitle>
                <v-card-text>
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
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-subtitle>
                  <strong> {{ $t('Client info') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    clearable
                    v-model="item.fullname"
                    type="text"
                    :label="$t('Client fullname')"
                    prepend-icon="mdi-account-circle-outline"
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

                  <v-text-field
                    clearable
                    v-model="item.phone"
                    type="text"
                    :label="$t('Client phone')"
                    prepend-icon="mdi-phone-outline"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-subtitle>
                  <strong> {{ $t('Mail number') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    clearable
                    v-model="item.mail"
                    type="text"
                    :label="$t('Client mail number')"
                    prepend-icon="mdi-email-outline"
                  />
                </v-card-text>

                <v-card-subtitle>
                  <strong> {{ $t('Comment') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-textarea
                    clearable
                    rows="2"
                    type="text"
                    v-model="item.comment"
                    :label="$t('Comment')"
                    prepend-inner-icon="mdi-text-box-outline"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-subtitle>
                  <strong> {{ $t('Internet') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-card-text>
                    <v-text-field
                      clearable
                      v-model="item.internet_mail"
                      type="text"
                      :label="$t('Internet mail number')"
                      prepend-icon="mdi-email-outline"
                    />
                  </v-card-text>

                  <v-card-subtitle>
                    <strong> {{ $t('Date open internet') }} </strong>
                  </v-card-subtitle>
                  <v-card-text>
                    <CustomDateOnlyPicker
                      v-model="item.internet_dateOpen"
                      :label="$t('Date open internet')"
                    />
                  </v-card-text>

                  <v-card-subtitle>
                    <strong> {{ $t('Date close internet') }} </strong>
                  </v-card-subtitle>
                  <v-card-text>
                    <CustomDateOnlyPicker
                      v-model="item.internet_dateClose"
                      :label="$t('Date close internet')"
                    />
                  </v-card-text>

                  <v-card-text>
                    <v-textarea
                      clearable
                      rows="2"
                      type="text"
                      v-model="item.internet_comment"
                      :label="$t('Comment')"
                      prepend-inner-icon="mdi-text-box-outline"
                    />
                  </v-card-text>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-card flat class="my-2">
                <v-card-subtitle>
                  <strong> {{ $t('E-mails') }} </strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-data-table
                    dense
                    fixed-header
                    sort-by="login"
                    :search="search"
                    :headers="headers"
                    :items="item.email"
                  >
                    <template v-slot:top>
                      <v-toolbar flat>
                        <v-spacer />
                        <v-responsive max-width="240" class="mr-2">
                          <v-text-field
                            flat
                            clearable
                            single-line
                            hide-details
                            v-model="search"
                            prepend-inner-icon="mdi-magnify"
                            :label="$t('Search in table')"
                            class="ma-0"
                          />
                        </v-responsive>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-on="on" v-bind="attrs" class="mx-2" @click="addItem()">
                              <v-icon> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                          </template>
                          <span> {{ $t('Create new record') }} </span>
                        </v-tooltip>
                      </v-toolbar>
                    </template>

                    <template v-slot:[`item.login`]="{ item, index }">
                      <v-text-field
                        dense
                        autofocus
                        single-line
                        hide-details
                        v-model="editedItem.login"
                        v-if="editedIndex === index"
                      />
                      <span v-else> {{ item.login }} </span>
                    </template>

                    <template v-slot:[`item.mail`]="{ item, index }">
                      <v-text-field
                        dense
                        single-line
                        hide-details
                        v-model="editedItem.mail"
                        v-if="editedIndex === index"
                      />
                      <span v-else> {{ item.mail }} </span>
                    </template>

                    <template v-slot:[`item.dateOpen`]="{ item, index }">
                      <CustomDateOnlyPicker
                        v-model="editedItem.dateOpen"
                        :label="$t('Date open')"
                        v-if="editedIndex === index"
                      />
                      <span v-else> {{ item.dateOpen }} </span>
                    </template>

                    <template v-slot:[`item.dateClose`]="{ item, index }">
                      <CustomDateOnlyPicker
                        v-model="editedItem.dateClose"
                        :label="$t('Date close')"
                        v-if="editedIndex === index"
                      />
                      <span v-else> {{ item.dateClose }} </span>
                    </template>

                    <template v-slot:[`item.comment`]="{ item, index }">
                      <v-text-field
                        dense
                        single-line
                        hide-details
                        v-model="editedItem.comment"
                        v-if="editedIndex === index"
                      />
                      <span v-else> {{ item.comment }} </span>
                    </template>

                    <template v-slot:[`item.fullname`]="{ item, index }">
                      <v-text-field
                        dense
                        single-line
                        hide-details
                        v-model="editedItem.fullname"
                        v-if="editedIndex === index"
                      />
                      <span v-else> {{ item.fullname }} </span>
                    </template>

                    <template v-slot:[`item.actions`]="{ item, index }">
                      <div v-if="editedIndex === index">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              small
                              v-on="on"
                              v-bind="attrs"
                              class="mx-2"
                              @click="closeItem()"
                            >
                              mdi-window-close
                            </v-icon>
                          </template>
                          <span> {{ $t('Close record') }} </span>
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small v-on="on" v-bind="attrs" class="mx-2" @click="saveItem()">
                              mdi-content-save
                            </v-icon>
                          </template>
                          <span> {{ $t('Save record') }} </span>
                        </v-tooltip>
                      </div>
                      <div v-else>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              small
                              v-on="on"
                              v-bind="attrs"
                              class="mx-2"
                              @click="editItem(item)"
                            >
                              mdi-pencil
                            </v-icon>
                          </template>
                          <span> {{ $t('Edit record') }} </span>
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              small
                              v-on="on"
                              v-bind="attrs"
                              class="mx-2"
                              @click="deleteItem(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                          <span> {{ $t('Delete record') }} </span>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
      IDItem: null,
      title: null,

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
        ipv4: [(v) => (!!v && v === null) || this.IPv4.test(v) || 'Examples: 127.0.0.1 (single)']
      },

      search: '',

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
    IPv4() {
      return this.$store.state.regex.IPv4;
    },

    headers() {
      return [
        {
          text: this.$t('Login'),
          value: 'login',
          sortable: false
        },
        {
          text: this.$t('Mail number'),
          value: 'mail',
          sortable: false
        },
        {
          text: this.$t('Open date'),
          value: 'dateOpen',
          sortable: false
        },
        {
          text: this.$t('Close date'),
          value: 'dateClose',
          sortable: false
        },
        {
          text: this.$t('Comment'),
          value: 'comment',
          sortable: false
        },
        {
          text: this.$t('Fullname'),
          value: 'fullname',
          sortable: false
        },
        {
          text: this.$t('Actions'),
          value: 'actions',
          align: 'center',
          width: '100px',
          sortable: false,
          filterable: false
        }
      ];
    }
  },

  methods: {
    async onItem(id) {
      this.editedIndex = -1;
      this.IDItem = id;
      try {
        this.title = this.IDItem ? this.$t('Edit current record') : this.$t('Create new record');

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
