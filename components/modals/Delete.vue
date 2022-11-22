<template>
  <v-snackbar
    centered
    absolute
    vertical
    :timeout="5000"
    v-model="snackbar"
    color="warning"
    transition="scroll-y-transition"
  >
    {{ $t('Are you sure you want to delete this item') }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="mOk"> {{ $t('Ok') }} </v-btn>
      <v-btn text v-bind="attrs" @click="snackbar = false">
        {{ $t('Cancel') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      IDItem: null,
      api: null
    };
  },

  watch: {
    snackbar(val) {
      val || this.mCancel();
    }
  },

  methods: {
    onConfirm(id, api) {
      this.api = api;
      this.IDItem = id;
      this.snackbar = true;
    },

    async mOk() {
      await this.$store.dispatch(`api/${this.api}/removeOne`, this.IDItem);
      this.snackbar = false;
      this.$emit('closeEvent');
      this.$toast.success(this.$t('Record is removed'));
    },

    mCancel() {
      this.IDItem = null;
      this.api = null;
    }
  }
};
</script>
