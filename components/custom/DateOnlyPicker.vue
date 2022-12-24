<template>
  <v-menu
    offset-y
    ref="menu"
    v-model="menu"
    :return-value.sync="model"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        clearable
        v-on="on"
        v-bind="attrs"
        v-model="model"
        :label="label"
        prepend-icon="mdi-calendar"
      />
    </template>
    <v-date-picker v-model="model" no-title scrollable :locale="$i18n.locale">
      <v-spacer />
      <v-btn text color="primary" @click="menu = false">
        {{ $t('Cancel') }}
      </v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(model)">
        {{ $t('Ok') }}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Input date'
    }
  },
  data() {
    return {
      menu: false
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
};
</script>
