<template>
  <v-container full-height>
    <v-row no-gutters justify="center">
      <v-col cols="10">
        <v-card class="pa-2" flat tile>
          <v-card-title class="text-h3 font-weight-bold mb-2">
            {{ article.title }}
          </v-card-title>
          <v-card-subtitle class="mb-6">
            {{ article.description }} <br />
            <span class="text--secondary" v-if="article.created">
              {{ $t('Author') }}: {{ article.author }}
            </span>
            |
            <span class="text--secondary" v-if="article.created">
              {{ $t('created at') }} {{ article.created }}
            </span>
          </v-card-subtitle>
          <v-card-text>
            <article v-if="article">
              <nuxt-content :document="article" />
            </article>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-navigation-drawer app clipped right width="300">
      <template v-slot:prepend>
        <v-sheet>
          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar tile>
                <v-icon large> {{ apppage.appicon }} </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="body-1 text-uppercase font-weight-bold">
                  {{ apppage.apptitle }}
                </v-list-item-title>
                <v-list-item-subtitle> {{ apppage.appsubtitle }} </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </template>
      <v-text-field
        flat
        dense
        rounded
        outlined
        clearable
        single-line
        hide-details
        :value="search"
        :label="'Поиск документации'"
        prepend-inner-icon="mdi-magnify"
        class="my-4 mx-6"
      />
      <v-list>
        <v-list-item
          link
          v-for="item in articles"
          :key="item.slug"
          class="ml-2"
          @click="getArticle(item.slug)"
        >
          <v-list-item-icon class="mr-4">
            <v-icon> mdi-sticker-text-outline </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> {{ item.title }}</v-list-item-title>
            <v-list-item-subtitle> {{ item.description }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-alpha-b-circle-outline',
    apptitle: 'Blog of helpdesk',
    appsubtitle: 'Blog of the technical support department'
  },

  middleware: ['auth'],

  layout: 'apps',

  async asyncData({ $content }) {
    const articles = await $content('articles')
      .only(['title', 'description', 'category', 'slug'])
      .sortBy('position')
      .fetch();
    const article = await $content('index').fetch();

    return { article, articles };
  },

  data() {
    return {
      search: ''
    };
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    }
  },

  filters: {
    dateToStr: function (value) {
      return value ? new Date(value).toLocaleDateString() : '-';
    }
  },

  methods: {
    async getArticle(slug) {
      this.article = await this.$content(`articles/${slug}`).fetch();
    }
  }
};
</script>

<style scoped>
article {
  font-size: 16px;
  line-height: 1.8;
}
</style>
