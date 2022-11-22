<template>
  <NuxtChild />
</template>

<script>
export default {
  meta: {
    appicon: 'mdi-apps',
    apptitle: 'Helpdesk administration panel',
    appsubtitle: 'Helpdesk of the technical support department'
  },
  middleware: ['is-admin'],
  layout: 'apps'
};
</script>
