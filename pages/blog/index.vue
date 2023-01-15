<template>
  <v-container fill-height fluid class="pa-0">
    <v-card class="fill-height pa-2" flat tile>
      <v-row no-gutters justify="center">
        <v-col cols="10">
          <v-card-title class="text-h3 font-weight-bold mb-2">
            {{ article.title }}
          </v-card-title>
          <v-card-subtitle class="mb-6 text--primary">
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
            <article v-if="article" class="text--primary">
              <nuxt-content :document="article" />
            </article>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
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
      </template>

      <v-list flat two-line class="ml-2">
        <v-list-item-group v-for="(item, index) in articles" :key="index">
          <v-list-item v-if="!item.children" link @click="getArticle(item.path)" class="pl-4">
            <v-list-item-avatar class="mr-2">
              <v-icon> mdi-sticker-text-outline </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title> {{ item.title }} </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-group color="none" v-if="item.children" class="pl-0">
            <template v-slot:activator>
              <v-list-item-avatar class="mr-2">
                <v-icon> mdi-sticker-text-outline </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title> {{ item.category }} </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list flat>
              <v-list-item
                exact
                v-for="item in item.children"
                :key="item.path"
                @click="getArticle(item.path)"
                class="ml-0 pl-4"
              >
                <v-list-item-avatar class="mr-2">
                  <v-icon> mdi-sticker-text-outline </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title> {{ item.title }} </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list-group>
        </v-list-item-group>
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

  layout: 'apps',

  async asyncData({ $content }) {
    const articles = await $content('articles', { deep: true })
      .only(['title', 'description', 'category', 'slug', 'path'])
      .sortBy('position')
      .fetch();
    const article = await $content('index').fetch();
    const groupArticles = articles.reduce((group, arr) => {
      const { category } = arr;
      group[category] = group[category] ?? [];
      group[category].push(arr);
      return group;
    }, {});
    const articlesArr = [];
    Object.entries(groupArticles).forEach(([key, value]) => {
      if (key === 'null') articlesArr.push(...value);
      else articlesArr.push({ category: key, children: value });
    });
    return { article, articles: articlesArr };
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
    async getArticle(article) {
      this.article = await this.$content(article).fetch();
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
