<template>
  <v-container fill-height fluid v-if="$config.fileHosting">
    <v-row align="center" justify="center" grow>
      <v-col cols="12" xl="10" lg="8">
        <v-container fill-height fluid style="height: 80vh !important">
          <v-layout column fill-height>
            <v-flex>
              <v-list two-line>
                <v-list-item>
                  <v-list-item-avatar tile>
                    <v-icon large> {{ apppage.appicon }} </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h5">
                      <strong>
                        {{ $t(apppage.apptitle) }}
                      </strong>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t(apppage.appsubtitle) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-responsive width="240" class="mr-2">
                      <v-text-field
                        flat
                        clearable
                        single-line
                        hide-details
                        v-model="search"
                        :label="$t('Search')"
                        prepend-inner-icon="mdi-folder-search-outline"
                      />
                    </v-responsive>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-flex>
            <v-flex class="overflow-auto">
              <v-treeview
                dense
                open-all
                v-model="tree"
                :search="search"
                :open.sync="initiallyOpen"
                :items="fileHostingTree"
                item-key="name"
                open-on-click
              >
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.type === 'directory'">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                  </v-icon>
                  <v-icon v-else left>
                    {{ files[item.extension] }}
                  </v-icon>
                </template>
                <template v-slot:label="{ item }">
                  <span v-if="item.type === 'directory'">
                    <strong>
                      {{ item.name.toUpperCase() }}
                    </strong>
                  </span>
                  <span v-else> {{ item.name }} </span>
                </template>
                <template v-slot:append="{ item }">
                  <div v-if="item.type === 'file'">
                    <span class="mx-2">
                      <strong>{{ $t('File size') }}</strong> :
                      {{ item.size | byteFormat }}
                    </span>
                    <span class="mx-2">
                      <strong>{{ $t('Create date') }}</strong> :
                      {{ item.mtime | dateToStr }}
                    </span>
                    <v-btn
                      small
                      rounded
                      download
                      :href="item.path | sliceStatic"
                      color="primary"
                      class="mx-4"
                    >
                      {{ $t('Download') }}
                    </v-btn>
                  </div>
                </template>
              </v-treeview>
            </v-flex>
          </v-layout>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-cloud-download-outline',
    apptitle: 'HD File Hosting',
    appsubtitle: 'File hosting of the technical support department'
  },
  layout({ $auth }) {
    return $auth.loggedIn ? 'apps' : 'default';
  },

  data() {
    return {
      search: '',
      initiallyOpen: ['docs'],
      files: {
        '.md': 'mdi-language-markdown',
        '.pdf': 'mdi-file-pdf',
        '.png': 'mdi-file-image',
        '.txt': 'mdi-file-document-outline',
        '.xls': 'mdi-file-excel',
        '.doc': 'mdi-file-word-outline',
        '.docx': 'mdi-file-word-outline',
        '.zip': 'mdi-zip-box-outline',
        '.rar': 'mdi-zip-box-outline',
        '.cab': 'mdi-zip-box-outline',
        '.exe': 'mdi-file-code-outline',
        '.msi': 'mdi-file-code-outline'
      },
      tree: []
    };
  },

  computed: {
    apppage() {
      return this.$store.getters.apppage;
    },

    fileHostingTree() {
      return this.$config.fileHosting.children;
    }
  },

  filters: {
    dateToStr: function (value) {
      return value ? new Date(value).toLocaleDateString() : '-';
    },

    byteFormat: function (value) {
      if (!value) return '-';
      const index = Math.floor(Math.log(value) / Math.log(1024));
      return (
        (value / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
      );
    },

    sliceStatic: function (value) {
      return value.slice(6);
    }
  }
};
</script>

<style scoped>
.flex,
.child-flex > * {
  flex: none;
}
</style>
