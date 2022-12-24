<template>
  <NuxtChild />
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-apps',
    apptitle: 'Helpdesk applications',
    appsubtitle: 'Helpdesk of the technical support department'
  },

  middleware: ['is-scope'],

  layout: 'apps'
};
</script>
