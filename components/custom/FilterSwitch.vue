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
      <v-btn icon small v-bind="attrs" v-on="on">
        <v-icon small :color="model ? 'primary' : ''"> mdi-filter-outline </v-icon>
      </v-btn>
    </template>
    <v-list flat dense class="py-0">
      <v-list-item dense class="px-2">
        <v-list-item-content>
          <v-switch
            inset
            hide-details
            color="warning"
            :value="model"
            :label="label"
            @change="$refs.menu.save($event ? $event.toString() : '')"
            class="mx-4 my-2"
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
