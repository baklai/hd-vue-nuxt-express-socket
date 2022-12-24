<template>
  <v-menu
    auto
    bottom
    offset-y
    ref="menu"
    v-model="menu"
    max-width="240px"
    :return-value.sync="model"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-on="on" v-bind="attrs">
        <v-icon small :color="model ? 'primary' : ''"> mdi-filter-outline </v-icon>
      </v-btn>
    </template>
    <v-list flat dense class="py-0">
      <v-list-item dense class="px-2">
        <v-list-item-content>
          <v-autocomplete
            dense
            outlined
            clearable
            hide-details
            persistent-hint
            :item-value="itemValue"
            :item-text="itemText"
            :label="label"
            :items="items"
            :value="model"
            append-icon=""
            @input="$refs.menu.save($event)"
            prepend-inner-icon="mdi-magnify"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: []
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    itemText: {
      type: String,
      default: 'title'
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
