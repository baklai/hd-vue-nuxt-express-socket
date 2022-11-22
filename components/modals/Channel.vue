<template>
  <v-dialog eager persistent scrollable v-model="dialog" width="600px" overlay-color="#525252">
    <v-card>
      <v-card-title class="pt-0">
        <v-list flat>
          <v-list-item two-line class="pa-0">
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-swap-horizontal </v-icon>
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
            <v-btn icon v-on="on" v-bind="attrs" @click="close">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Close') }} </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="save()">
          <v-row>
            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-text>
                  <v-text-field
                    clearable
                    v-model="item.locationFrom"
                    type="text"
                    :label="$t('Location start')"
                    prepend-icon="mdi-office-building-marker-outline"
                  />
                  <v-text-field
                    clearable
                    v-model="item.unitFrom"
                    type="text"
                    :label="$t('Unit start')"
                    prepend-icon="mdi-expansion-card-variant"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card flat class="my-2">
                <v-card-text>
                  <v-text-field
                    clearable
                    v-model="item.locationTo"
                    type="text"
                    :label="$t('Location end')"
                    prepend-icon="mdi-office-building-marker-outline"
                  />
                  <v-text-field
                    clearable
                    v-model="item.unitTo"
                    type="text"
                    :label="$t('Unit end')"
                    prepend-icon="mdi-expansion-card-variant"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-row>
              <v-col cols="12">
                <v-card flat class="my-2">
                  <v-card-text>
                    <v-text-field
                      clearable
                      v-model="item.level"
                      type="text"
                      :label="$t('Level')"
                      prepend-icon=""
                    />

                    <v-text-field
                      clearable
                      v-model="item.type"
                      type="text"
                      :label="$t('Type')"
                      prepend-icon=""
                    />

                    <v-text-field
                      clearable
                      v-model="item.speed"
                      type="text"
                      :label="$t('Speed')"
                      prepend-icon=""
                    />

                    <v-text-field
                      clearable
                      v-model="item.status"
                      type="text"
                      :label="$t('Status')"
                      prepend-icon=""
                    />

                    <v-text-field
                      clearable
                      v-model="item.operator"
                      type="text"
                      :label="$t('Operator')"
                      prepend-icon=""
                    />

                    <v-text-field
                      clearable
                      v-model="item.composition"
                      type="text"
                      :label="$t('Composition')"
                      prepend-icon=""
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
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
      status: false,
      IDItem: null,

      item: {
        locationFrom: null,
        unitFrom: null,
        locationTo: null,
        unitTo: null,
        level: null,
        type: null,
        speed: null,
        status: null,
        operator: null,
        composition: null
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
      return this.$t('Channels list');
    }
  },

  methods: {
    async onItem(id) {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.IDItem = id;
      try {
        this.status = this.IDItem ? this.$t('Edit current record') : this.$t('Create new record');
        if (this.IDItem) {
          const data = await this.$store.dispatch('api/channel/findOne', this.IDItem);
          this.item.locationFrom = data.locationFrom;
          this.item.unitFrom = data.unitFrom;
          this.item.locationTo = data.locationTo;
          this.item.unitTo = data.unitTo;
          this.item.level = data.level;
          this.item.type = data.type;
          this.item.speed = data.speed;
          this.item.status = data.status;
          this.item.operator = data.operator;
          this.item.composition = data.composition;
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
            await this.$store.dispatch('api/channel/updateOne', {
              id: this.IDItem,

              locationFrom: this.item.locationFrom,
              unitFrom: this.item.unitFrom,
              locationTo: this.item.locationTo,
              unitTo: this.item.unitTo,
              level: this.item.level,
              type: this.item.type,
              speed: this.item.speed,
              status: this.item.status,
              operator: this.item.operator,
              composition: this.item.composition
            });
            this.$toast.success(this.$t('Record is updated'));
          } else {
            await this.$store.dispatch('api/channel/createOne', {
              locationFrom: this.item.locationFrom,
              unitFrom: this.item.unitFrom,
              locationTo: this.item.locationTo,
              unitTo: this.item.unitTo,
              level: this.item.level,
              type: this.item.type,
              speed: this.item.speed,
              status: this.item.status,
              operator: this.item.operator,
              composition: this.item.composition
            });
            this.$toast.success(this.$t('Record is created'));
          }
          this.close();
        } catch (err) {
          console.error(err);
          this.$toast.global.error();
        }
      } else {
        this.$toast.error(this.$t('Fill in all required fields'));
      }
    },

    close() {
      this.IDItem = null;
      this.dialog = false;
      this.$emit('closeEvent');
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    }
  }
};
</script>
