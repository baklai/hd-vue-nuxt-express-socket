<template>
  <v-dialog persistent scrollable v-model="dialog" max-width="600" overlay-color="#525252">
    <v-card>
      <v-card-title class="pt-0">
        <v-list flat>
          <v-list-item two-line class="pa-0">
            <v-list-item-avatar tile>
              <v-icon x-large> mdi-calendar-month-outline </v-icon>
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
            v-model.trim="item.name"
            :label="$t('Title event')"
          />
          <CustomDateTimePicker
            v-model="item.date"
            :rules="rules.require"
            :label="$t('Date of event')"
          />
          <v-text-field clearable type="text" v-model.trim="item.href" :label="$t('Event url')" />
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
      item: {
        name: null,
        date: null,
        href: null,
        comment: null
      },

      rules: {
        require: [(v) => !!v || this.$t('Field is required')]
      }
    };
  },

  computed: {
    title() {
      return this.$t('Calendar event');
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
        if (this.IDItem) {
          const item = await this.$store.dispatch('api/event/findOne', this.IDItem);
          this.item.name = item.name;
          this.item.date = item.date;
          this.item.href = item.href;
          this.item.comment = item.comment;
        } else {
          this.onClean();
        }
        this.dialog = true;
      } catch (err) {
        console.error(err);
        this.$toast.error(this.$t('Record not found'));
      }
    },

    async onSave() {
      if (this.$refs.form.validate()) {
        try {
          if (this.IDItem) {
            await this.$store.dispatch('api/event/updateOne', {
              id: this.IDItem,

              ...this.item
            });
            this.IDItem = null;
            this.onClose();
            this.$toast.success(this.$t('Record is updated'));
          } else {
            await this.$store.dispatch('api/event/createOne', this.item);
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

    async onDelete() {
      try {
        if (this.IDItem) {
          await this.$store.dispatch('api/event/removeOne', this.IDItem);
          this.$toast.success(this.$t('Record is removed'));
        } else {
          this.$toast.success(this.$t('Record not selected'));
        }
      } catch (err) {
        console.error(err);
        this.$toast.error(err.message);
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
