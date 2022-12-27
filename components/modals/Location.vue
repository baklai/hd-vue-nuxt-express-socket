<template>
  <v-dialog persistent scrollable v-model="dialog" max-width="600" overlay-color="#525252">
    <v-card>
      <v-card-title class="pt-0">
        <v-list flat>
          <v-list-item two-line class="pa-0">
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-map-marker-outline </v-icon>
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

        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" class="mr-2">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list flat dense subheader>
            <v-list-item @click="onUpdate()">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-cached </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ $t('Update records') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onItem(null)">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-plus-circle-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title> {{ $t('Create record') }} </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onDelete()" v-if="$hasScope('location:remove:one')">
              <v-list-item-icon class="mr-1">
                <v-icon small> mdi-trash-can-outline </v-icon>
              </v-list-item-icon>
              <v-list-item-title> {{ $t('Delete record') }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

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
        <v-autocomplete
          dense
          outlined
          clearable
          hide-details
          return-object
          hide-selected
          persistent-hint
          item-value="id"
          item-text="title"
          v-model="select"
          :label="$t('Search in database')"
          prepend-inner-icon="mdi-magnify"
          :items="items"
          class="my-2"
          @change="onChange"
        />
      </v-card-text>

      <v-card-text>
        <v-form ref="form" class="px-2" lazy-validation @submit.prevent="onSave()">
          <v-text-field
            dense
            outlined
            clearable
            :rules="rules.require"
            v-model.trim="item.title"
            :label="$t('Location name')"
          />
          <v-text-field
            dense
            outlined
            clearable
            v-model.trim="item.region"
            :label="$t('Location region')"
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
      select: null,
      status: false,
      IDItem: null,

      items: [],
      item: {
        title: null,
        region: null
      },

      rules: {
        require: [(v) => !!v || this.$t('Field is required')]
      }
    };
  },

  computed: {
    title() {
      return this.$t('Location');
    },
    subtitle() {
      return this.$t('Locations from database');
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
        this.items = await this.$store.dispatch('api/location/findAll');
        if (this.IDItem) {
          const item = await this.$store.dispatch('api/location/findOne', this.IDItem);
          this.item = { ...item };
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
            await this.$store.dispatch('api/location/updateOne', {
              id: this.IDItem,

              ...this.item
            });
            this.IDItem = null;
            await this.onUpdate();
            this.$toast.success(this.$t('Record is updated'));
          } else {
            await this.$store.dispatch('api/location/createOne', this.item);
            await this.onUpdate();
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

    async onDelete() {
      try {
        if (this.IDItem) {
          await this.$store.dispatch('api/location/removeOne', this.IDItem);
          await this.onUpdate();
          this.$toast.success(this.$t('Record is removed'));
        } else {
          this.$toast.success(this.$t('Record not selected'));
        }
      } catch (err) {
        console.error(err);
        this.$toast.error(err.message);
      }
    },

    async onUpdate() {
      try {
        this.onClean();
        this.items = await this.$store.dispatch('api/location/findAll');
        this.$toast.success(this.$t('Record is updated'));
      } catch (err) {
        console.error(err);
        this.$toast.error(err.message);
      }
    },

    onChange(value) {
      value ? this.onItem(value.id) : this.onItem(null);
    },

    onClean: function () {
      this.select = null;
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
