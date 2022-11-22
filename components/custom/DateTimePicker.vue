<template>
  <v-dialog v-model="display" :width="340">
    <template v-slot:activator="{ on }">
      <v-text-field
        clearable
        v-bind="textFieldProps"
        :disabled="disabled"
        :label="label"
        :value="formattedDatetime"
        v-on="on"
        readonly
      >
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab">
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon> mdi-calendar-range </v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected">
            <slot name="timeIcon">
              <v-icon> mdi-clock-outline </v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              no-title
              scrollable
              full-width
              show-current
              v-model="date"
              :locale="$i18n.locale"
              v-bind="datePickerProps"
              @input="showTimePicker"
            />
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              v-model="time"
              v-bind="timePickerProps"
              full-width
              format="24hr"
              landscape
              no-title
            />
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions" :parent="this">
          <v-btn text color="primary" @click.native="clearHandler">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn text color="primary" @click="okHandler">
            {{ $t('Ok') }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { format, parse } from 'date-fns';

const DEFAULT_DATE = '';
const DEFAULT_TIME = '00:00';
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_TIME_FORMAT = 'HH:mm';

export default {
  model: {
    prop: 'datetime',
    event: 'input'
  },
  props: {
    datetime: {
      type: [Date, String],
      default: null
    },
    disabled: {
      type: Boolean
    },
    label: {
      type: String,
      default: ''
    },
    dateFormat: {
      type: String,
      default: DEFAULT_DATE_FORMAT
    },
    timeFormat: {
      type: String,
      default: DEFAULT_TIME_FORMAT
    },
    textFieldProps: {
      type: Object
    },
    datePickerProps: {
      type: Object
    },
    timePickerProps: {
      type: Object
    }
  },
  data() {
    return {
      display: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    dateTimeFormat() {
      return this.dateFormat + ' ' + this.timeFormat;
    },

    defaultDateTimeFormat() {
      return DEFAULT_DATE_FORMAT + ' ' + DEFAULT_TIME_FORMAT;
    },

    formattedDatetime() {
      return this.selectedDatetime ? format(this.selectedDatetime, this.dateTimeFormat) : '';
    },

    selectedDatetime() {
      if (this.date && this.time) {
        let datetimeString = this.date + ' ' + this.time;

        return parse(datetimeString, this.defaultDateTimeFormat, new Date());
      } else {
        return null;
      }
    },

    dateSelected() {
      return !this.date;
    }
  },

  methods: {
    init() {
      if (!this.datetime) {
        return;
      }
      const datetime = new Date(this.datetime);
      let initDateTime;
      if (datetime instanceof Date) {
        initDateTime = datetime;
      } else if (typeof datetime === 'string' || datetime instanceof String) {
        initDateTime = parse(datetime, this.dateTimeFormat, new Date());
      }
      this.date = format(initDateTime, DEFAULT_DATE_FORMAT);
      this.time = format(initDateTime, DEFAULT_TIME_FORMAT);
    },

    okHandler() {
      this.resetPicker();
      this.$emit('input', this.selectedDatetime);
    },

    clearHandler() {
      this.resetPicker();
      this.date = DEFAULT_DATE;
      this.time = DEFAULT_TIME;
      this.$emit('input', null);
    },

    resetPicker() {
      this.display = false;
      this.activeTab = 0;
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true;
      }
    },

    showTimePicker() {
      this.activeTab = 1;
    }
  },
  watch: {
    datetime: function () {
      this.init();
    }
  }
};
</script>
