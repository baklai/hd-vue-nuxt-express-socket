<template>
  <v-container full-height fluid>
    <v-row class="fill-height">
      <v-col cols="12" xl="8" lg="8">
        <v-card flat class="mx-6">
          <v-toolbar flat width="100%">
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
          </v-toolbar>
          <v-card-text class="text-left code-ping">
            <v-form ref="pinger" lazy-validation @submit.prevent="onPing">
              <v-text-field
                type="text"
                prefix="ping"
                required
                clearable
                single-line
                persistent-hint
                :disabled="loading"
                prepend-inner-icon="mdi-chevron-right"
                append-outer-icon="mdi-send"
                :hint="$t('Example: 127.0.0.1s (single)')"
                :label="$t('Input target address').toLowerCase()"
                v-model.trim="target"
                :rules="targetRules"
                @click:clear="onClean"
                @keypress.enter="onPing"
                @click:append-outer="onPing"
              />
            </v-form>

            <v-container fill-height v-if="loading">
              <v-row class="fill-height" align-content="center" justify="center">
                <v-col class="text-subtitle-1 text-center" cols="12">
                  {{ $t('Getting your icmp ping') }}
                </v-col>
                <v-col cols="4">
                  <v-progress-linear rounded indeterminate height="6" />
                </v-col>
              </v-row>
            </v-container>

            <pre v-if="report" class="my-10"> {{ report.output }} </pre>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" xl="4" lg="4">
        <v-card flat class="mx-auto">
          <v-card-title>
            <v-icon left> mdi-format-list-bulleted </v-icon>
            {{ $t('List of ICMP Ping') }}
          </v-card-title>
          <v-divider />
          <v-virtual-scroll :items="targets" :item-height="40" height="400px">
            <template v-slot:default="{ item }">
              <v-list-item>
                <v-list-item-icon class="mr-2">
                  <v-icon small> mdi-lan-pending </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> {{ item }} </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn depressed small @click="onPingList(item)">
                    <v-icon color="orange darken-4" right> mdi-open-in-new </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-lan-pending',
    apptitle: 'ICMP Ping',
    appsubtitle: 'ICMP Ping service of the technical support department'
  },

  data() {
    return {
      dialog: false,
      loading: false,
      targets: [],
      target: null,
      report: null,
      targetRules: [
        (v) => !!v || this.$t('Field is required'),
        (v) => this.IPv4.test(v) || `${this.$t('Example')}: 127.0.0.1 (single)`
      ]
    };
  },

  watch: {
    targets: {
      handler(value) {
        localStorage.setItem(`${this.$route.name}.targets`, JSON.stringify(value));
      },
      deep: true
    }
  },

  mounted() {
    this.targets = localStorage[`${this.$route.name}.targets`]
      ? JSON.parse(localStorage.getItem(`${this.$route.name}.targets`))
      : this.targets;
  },

  filters: {
    jsonToStr: function (value) {
      return value ? JSON.stringify(value, null, '\t') : '-';
    }
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    },
    hostname() {
      return this.$store.state.regex.hostname;
    },
    IPv4() {
      return this.$store.state.regex.IPv4;
    }
  },

  methods: {
    onClean() {
      this.report = null;
      this.$refs.pinger.reset();
      this.$refs.pinger.resetValidation();
    },

    async onPing() {
      if (this.$refs.pinger.validate()) {
        this.targets.push(this.target);
        this.report = null;
        this.loading = true;
        this.$toast.info(`Ping target ${this.target} run`);
        this.report = await this.$store.dispatch('api/tool/getOPING', this.target);
        this.loading = false;
      } else {
        this.$toast.error(this.$t('Enter correct target for ping'));
      }
    },

    async onPingList(target) {
      this.target = target;
      this.report = null;
      this.loading = true;
      this.$toast.info(`Ping target ${this.target} run`);
      this.report = await this.$store.dispatch('api/tool/getOPING', target);
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.code-ping {
  height: 100%;
  padding: 50px 50px 0 50px;
}
</style>
