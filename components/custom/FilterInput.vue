<template>
  <v-text-field
    flat
    clearable
    single-line
    hide-details
    :label="label"
    :value.sync="model"
    @keyup.enter="model = $event.target.value"
    @click:clear="model = ''"
    prepend-inner-icon="mdi-magnify"
    class="ma-0"
  />
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
      default: 'Search in...'
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
