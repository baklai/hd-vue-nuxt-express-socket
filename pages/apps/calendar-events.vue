<template>
  <v-container full-height fluid class="pa-0" v-resize="onResize">
    <ModalsDelete ref="delete" @closeEvent="getItems" v-if="$hasScope('api:event:remove:one')" />
    <ModalsEvent ref="event" @closeEvent="getItems" v-if="$hasScope('api:event:find:one')" />

    <v-card :height="windowSize.y - 64 - 64 - 64">
      <v-toolbar flat>
        <v-icon large left> {{ apppage.appicon }} </v-icon>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t(apppage.apptitle) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t(apppage.appsubtitle) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-spacer />

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" @click="cleanFilters()" class="mx-2">
              <v-icon> mdi-filter-remove-outline </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Clear filters') }} </span>
        </v-tooltip>
        <v-tooltip bottom v-if="$hasScope('api:event:create:one')">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" @click="onItem(null)" class="mx-2">
              <v-icon> mdi-plus-circle-outline </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Create record') }} </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon class="mx-2" v-on="on" v-bind="attrs" @click="getItems">
              <v-icon> mdi-cached </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Update records') }} </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon class="mx-2" v-on="on" v-bind="attrs">
              <v-icon v-on="on" v-bind="attrs"> mdi-cog-outline </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('Options') }} </span>
        </v-tooltip>
      </v-toolbar>

      <v-calendar
        ref="calendar"
        show-week
        v-model="value"
        :events="items"
        :weekdays="weekdays"
        :type="filters.type"
        :locale="$i18n.locale"
        @change="getItems"
        :event-more="false"
        @click:event="showEvent"
        :event-color="getEventColor"
      >
        <template v-slot:day="{ weekday }">
          <div v-if="weekday === 0 || weekday === 6" class="day-off"></div>
        </template>

        <template v-slot:event="{ event }">
          <span style="font-weight: bold">
            <v-icon x-small dark left class="mr-1"> mdi-bookmark </v-icon>
            {{ event.date | getTime }}
          </span>
          -
          {{ event.name }}
        </template>
      </v-calendar>

      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card flat class="mx-auto" max-width="400" min-width="300">
          <v-card-title class="py-2">
            <v-icon left> mdi-calendar-month-outline </v-icon>
            {{ $t('Event') }}
            <v-spacer />
            <v-menu offset-y open-on-hover>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-list flat dense>
                <v-list-item link target="_blank" :href="selectedEvent.href">
                  <v-list-item-icon class="mr-1">
                    <v-icon small> mdi-open-in-new </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ $t('Open url') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="$hasScope('api:event:create:one')" @click="onItem(null)">
                  <v-list-item-icon class="mr-1">
                    <v-icon small> mdi-plus-circle-outline </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ $t('Create record') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="$hasScope('api:event:update:one')"
                  @click="onItem(selectedEvent.id)"
                >
                  <v-list-item-icon class="mr-1">
                    <v-icon small> mdi-note-edit-outline </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ $t('Edit record') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="onDelete(selectedEvent.id)"
                  v-if="$hasScope('api:event:remove:one')"
                >
                  <v-list-item-icon class="mr-1">
                    <v-icon small> mdi-trash-can-outline </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ $t('Delete record') }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-on="on" v-bind="attrs" @click="selectedOpen = false">
                  <v-icon> mdi-close </v-icon>
                </v-btn>
              </template>
              <span> {{ $t('Close') }} </span>
            </v-tooltip>
          </v-card-title>
          <v-divider />
          <v-card-text class="py-2">
            <v-list class="pt-0">
              <v-list-item class="px-0">
                <v-list-item-icon class="mr-6">
                  <v-icon color="green"> mdi-bookmark </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="title">
                    {{ selectedEvent.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ selectedEvent.date | dateTimeToStr }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="px-0">
                <v-list-item-icon class="mr-6">
                  <v-icon> mdi-link </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    {{ $t('URL') }}
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    {{ selectedEvent.href }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        small
                        v-on="on"
                        v-bind="attrs"
                        @click="copyToClipboard(selectedEvent.href)"
                      >
                        <v-icon small> mdi-content-copy </v-icon>
                      </v-btn>
                    </template>
                    <span> {{ $t('Copy to clipboard') }} </span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item class="px-0">
                <v-list-item-icon class="mr-6">
                  <v-icon> mdi-format-align-left </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    {{ $t('Comment') }}
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    {{ selectedEvent.comment }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>

      <v-toolbar flat>
        <v-responsive max-width="150" class="mr-2">
          <v-select
            dense
            outlined
            hide-details
            persistent-hint
            full-width
            v-model="filters.type"
            :items="[
              { text: $t('Day'), value: 'day' },
              { text: $t('Week'), value: 'week' },
              { text: $t('Month'), value: 'month' }
            ]"
          />
        </v-responsive>

        <p class="ma-2" v-if="$refs.calendar">
          {{ $refs.calendar.title | capitalizeFirstLetter }}
        </p>

        <v-spacer />

        <v-sheet tile height="54" class="d-flex">
          <v-btn icon class="my-2 mx-4" @click="$refs.calendar.prev()">
            <v-icon> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn text small outlined class="my-3" height="auto" @click="setToday">
            {{ $t('Today') }}
          </v-btn>
          <v-btn icon class="my-2 mx-4" @click="$refs.calendar.next()">
            <v-icon> mdi-chevron-right </v-icon>
          </v-btn>
        </v-sheet>
      </v-toolbar>
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment';

export default {
  meta: {
    appicon: 'mdi-calendar-month-outline',
    apptitle: 'Сalendar of events',
    appsubtitle: 'Сalendar service of events  of the technical support department'
  },

  data() {
    return {
      windowSize: { x: 0, y: 0 },
      value: '',
      items: [],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      filters: {
        type: 'month'
      }
    };
  },

  watch: {
    filters: {
      handler(value) {
        localStorage.setItem(`${this.$route.name}.filters`, JSON.stringify(value));
        this.getItems();
      },
      deep: true
    }
  },

  async mounted() {
    this.filters = localStorage[`${this.$route.name}.filters`]
      ? JSON.parse(localStorage.getItem(`${this.$route.name}.filters`))
      : this.filters;
  },

  filters: {
    capitalizeFirstLetter: function (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },

    dateTimeToStr: function (value) {
      return value ? new Date(value).toLocaleString() : '-';
    },

    getTime: function (value) {
      return moment(value).format('HH:mm');
    }
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    }
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },

    copyToClipboard(value) {
      this.$clipboard(value);
      this.$toast.success(this.$t('Copied to clipboard'));
    },

    getEventColor(event) {
      return new Date(event.start) > Date.now() ? 'green' : 'grey';
    },

    async getItems() {
      try {
        this.loading = true;
        this.items = await this.$store.dispatch('api/event/findAll');
        this.$toast.success(this.$t('The list of records has been updated'));
      } catch (err) {
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    onItem(id) {
      if (this.$hasScope('api:event:find:one')) {
        this.selectedOpen = false;
        this.$refs.event.onItem(id);
      }
    },

    onDelete(id) {
      if (this.$hasScope('api:event:remove:one')) {
        this.selectedOpen = false;
        this.$refs.delete.onConfirm(id, 'event');
      }
    },

    setToday() {
      this.value = '';
    },

    cleanFilters() {
      this.filters.type = 'month';
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)));
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    }
  }
};
</script>

<style>
.v-event {
  width: 100%;
  margin: 1px 5px;
  padding: 0 2px;
}

.v-calendar-weekly {
  border-left: none !important;
}

.v-calendar.v-calendar-events .v-calendar-weekly__day {
  margin-right: 0px !important;
}

.theme--light .v-calendar-weekly__head {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.theme--dark .v-calendar-weekly__head {
  border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
}

.v-calendar-weekly__head-weekday {
  color: var(--v-text--primary) !important;
}

.v-calendar-weekly__head-weekday {
  font-weight: bold !important;
  background-color: var(--v-thover-base) !important;
}

.v-calendar-weekly__day.v-outside {
  background-color: var(--v-thover-base) !important;
}

.v-calendar-weekly__head-weeknumber {
  background-color: var(--v-thover-base) !important;
}

.v-calendar-weekly__weeknumber {
  background-color: var(--v-thover-base) !important;
}

.v-calendar-weekly__day.v-present .v-btn.v-btn--has-bg {
  height: 30px;
  width: 30px;
  margin: 5px 0px;
  opacity: 0.9;
  color: #ffffff !important;
  font-weight: bold !important;
  background-color: var(--v-info-base) !important;
}

.day-off {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.05;
  background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 0) 49.9%,
        gray 49.9%,
        gray 60%,
        rgba(0, 0, 0, 0) 60%
      )
      fixed,
    linear-gradient(45deg, gray 10%, rgba(0, 0, 0, 0) 10%) fixed,
    linear-gradient(-45deg, rgba(0, 0, 0, 0) 49.9%, gray 49.9%, gray 60%, rgba(0, 0, 0, 0) 60%)
      fixed,
    linear-gradient(-45deg, gray 10%, rgba(0, 0, 0, 0) 10%) fixed;
  background-size: 0.5em 0.5em;
}
</style>
