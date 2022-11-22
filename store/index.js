import { config } from '@/package.json';

export const state = () => ({
  error: null,

  isMaintenance: null,

  sidebar: null,

  author: {
    name: config.author.name,
    email: config.author.email,
    url: config.author.url
  },

  social: {
    facebook: config.author.social.facebook
      ? {
          icon: 'mdi-facebook',
          title: 'Facebook',
          href: config.author.social.facebook
        }
      : null,
    github: config.author.social.github
      ? {
          icon: 'mdi-github',
          title: 'Github',
          href: config.author.social.github
        }
      : null,
    linkedin: config.author.social.linkedin
      ? {
          icon: 'mdi-linkedin',
          title: 'Linkedin',
          href: config.author.social.linkedin
        }
      : null
  },

  app: {
    name: config.app.name,
    short_name: config.app.short_name,
    description: config.app.description
  },

  scopes: [
    { scope: 'app:selected-html', comment: 'Enabled selected from HTML' },
    { scope: 'app:notification:post', comment: 'Create notification for users' },
    { scope: 'app:channel:export:table', comment: 'Export channels in CSV file' },
    { scope: 'app:vpn:export:table', comment: 'Export VPNs in CSV file' },
    { scope: 'app:ipaddress:client:internet', comment: 'Show IP Addresses with Internet' },
    { scope: 'app:ipaddress:client:email', comment: 'Show IP Addresses with E-Mails' },
    { scope: 'app:ipaddress:export:table', comment: 'Export IP Addresses in CSV file' },
    { scope: 'app:ipaddress:export:internet', comment: 'Export IP with Internet to CSV file' },
    { scope: 'app:inspector:export:table', comment: 'Export PC SysInspector reports in CSV file' },
    { scope: 'app:logger:export:table', comment: 'Export logs in CSV file' },
    { scope: 'api:branch:find:all', comment: 'Select all branches from database' },
    { scope: 'api:branch:create:one', comment: 'Create branch in database' },
    { scope: 'api:branch:find:one', comment: 'Select one branch from database' },
    { scope: 'api:branch:update:one', comment: 'Update one branch in database' },
    { scope: 'api:branch:remove:one', comment: 'Remove one branch in database' },
    { scope: 'api:channel:find:all', comment: 'Select all channels from database' },
    { scope: 'api:channel:create:one', comment: 'Create channel in database' },
    { scope: 'api:channel:find:one', comment: 'Select one channel from database' },
    { scope: 'api:channel:update:one', comment: 'Update one channel in database' },
    { scope: 'api:channel:remove:one', comment: 'Remove one channel in database' },
    { scope: 'api:company:find:all', comment: 'Select all companies from database' },
    { scope: 'api:company:create:one', comment: 'Create company in database' },
    { scope: 'api:company:find:one', comment: 'Select one company from database' },
    { scope: 'api:company:update:one', comment: 'Update one company in database' },
    { scope: 'api:company:remove:one', comment: 'Remove one company in database' },
    { scope: 'api:department:find:all', comment: 'Select all departments from database' },
    { scope: 'api:department:create:one', comment: 'Create department in database' },
    { scope: 'api:department:find:one', comment: 'Select one department from database' },
    { scope: 'api:department:update:one', comment: 'Update one department in database' },
    { scope: 'api:department:remove:one', comment: 'Remove one department in database' },
    { scope: 'api:enterprise:find:all', comment: 'Select all enterprises from database' },
    { scope: 'api:enterprise:create:one', comment: 'Create enterprise in database' },
    { scope: 'api:enterprise:find:one', comment: 'Select one enterprise from database' },
    { scope: 'api:enterprise:update:one', comment: 'Update one enterprise in database' },
    { scope: 'api:enterprise:remove:one', comment: 'Remove one enterprise in database' },
    { scope: 'api:event:find:all', comment: 'Select all events from database' },
    { scope: 'api:event:create:one', comment: 'Create event in database' },
    { scope: 'api:event:find:one', comment: 'Select one event from database' },
    { scope: 'api:event:update:one', comment: 'Update one event in database' },
    { scope: 'api:event:remove:one', comment: 'Remove one event in database' },
    { scope: 'api:inspector:find:all', comment: 'Select all SysInspectors from database' },
    { scope: 'api:inspector:find:one', comment: 'Select one SysInspector from database' },
    { scope: 'api:inspector:remove:one', comment: 'Remove one inspector in database' },
    { scope: 'api:ipaddress:find:all', comment: 'Select all ipaddresses from database' },
    { scope: 'api:ipaddress:create:one', comment: 'Create ipaddress in database' },
    { scope: 'api:ipaddress:find:one', comment: 'Select one ipaddress from database' },
    { scope: 'api:ipaddress:update:one', comment: 'Update one ipaddress in database' },
    { scope: 'api:ipaddress:remove:one', comment: 'Remove one ipaddress in database' },
    { scope: 'api:ipaddress:search:one', comment: 'Search one ipaddress from database' },
    { scope: 'api:location:find:all', comment: 'Select all locations from database' },
    { scope: 'api:location:create:one', comment: 'Create location in database' },
    { scope: 'api:location:find:one', comment: 'Select one location from database' },
    { scope: 'api:location:update:one', comment: 'Update one location in database' },
    { scope: 'api:location:remove:one', comment: 'Remove one location in database' },
    { scope: 'api:logger:find:all', comment: 'Select all logs from database' },
    { scope: 'api:logger:remove:all', comment: 'Remove all logs in database' },
    { scope: 'api:notification:find:all', comment: 'Select all notifications from database' },
    { scope: 'api:notification:create:many', comment: 'Create many notification in database' },
    { scope: 'api:notification:remove:one', comment: 'Remove one notification in database' },
    { scope: 'api:position:find:all', comment: 'Select all positions from database' },
    { scope: 'api:position:create:one', comment: 'Create position in database' },
    { scope: 'api:position:find:one', comment: 'Select one position from database' },
    { scope: 'api:position:update:one', comment: 'Update one position in database' },
    { scope: 'api:position:remove:one', comment: 'Remove one position in database' },
    { scope: 'api:request:find:all', comment: 'Select all requests from database' },
    { scope: 'api:request:create:one', comment: 'Create request in database' },
    { scope: 'api:request:find:one', comment: 'Select one request from database' },
    { scope: 'api:request:update:one', comment: 'Update one request in database' },
    { scope: 'api:request:remove:one', comment: 'Remove one request in database' },
    { scope: 'api:statistic:ipaddress', comment: 'Select statistic of ipaddress' },
    { scope: 'api:statistic:inspector', comment: 'Select statistic of SysInspector' },
    { scope: 'api:statistic:request', comment: 'Select statistic of requests' },
    { scope: 'api:statistic:dashboard', comment: 'Select statistic for dashboard' },
    { scope: 'api:tool:get:inspector', comment: 'Tool SysInspector' },
    { scope: 'api:tool:get:rdp', comment: 'Tool RDP' },
    { scope: 'api:tool:get:vnc', comment: 'Tool VNC' },
    { scope: 'api:tool:get:ping', comment: 'Tool PING' },
    { scope: 'api:tool:get:oping', comment: 'Tool online PING' },
    { scope: 'api:unit:find:all', comment: 'Select all units from database' },
    { scope: 'api:unit:create:one', comment: 'Create unit in database' },
    { scope: 'api:unit:find:one', comment: 'Select one unit from database' },
    { scope: 'api:unit:update:one', comment: 'Update one unit in database' },
    { scope: 'api:unit:remove:one', comment: 'Remove one unit in database' },
    { scope: 'api:user:find:all', comment: 'Select all users from database' },
    { scope: 'api:user:create:one', comment: 'Create user in database' },
    { scope: 'api:user:find:one', comment: 'Select one user from database' },
    { scope: 'api:user:update:one', comment: 'Update one user in database' },
    { scope: 'api:user:remove:one', comment: 'Remove one user in database' },
    { scope: 'api:vpn:find:all', comment: 'Select all vpns from database' },
    { scope: 'api:vpn:create:one', comment: 'Create vpn in database' },
    { scope: 'api:vpn:find:one', comment: 'Select one vpn from database' },
    { scope: 'api:vpn:update:one', comment: 'Update one vpn in database' },
    { scope: 'api:vpn:remove:one', comment: 'Remove one vpn in database' }
  ]
});

export const getters = {
  copyright: (state) => {
    return `Copyright © ${new Date().getFullYear()} ${state.author.name}. All rights reserved.`;
  },

  apppage: (state) => {
    try {
      return { ...$nuxt.$root.$route.meta };
    } catch (err) {
      return {
        appicon: 'mdi-apps',
        apptitle: state.app.name,
        appsubtitle: state.app.description
      };
    }
  },

  scopes: (state) => {
    return state.scopes.map((item) => ({ scope: item.scope, comment: item.comment }));
  },

  error: (state) => state.error
};

export const mutations = {
  sidebar(state, val) {
    state.sidebar = val;
  },

  toggleDarkMode() {
    $nuxt.$root.$vuetify.theme.dark = !$nuxt.$root.$vuetify.theme.dark;
    if ($nuxt.$root.$vuetify.theme.dark) localStorage.setItem('app.theme', 'dark');
    else localStorage.setItem('app.theme', 'light');
  },

  setError(state, error) {
    state.error = error;
  },

  clearError(state) {
    state.error = null;
  }
};

export const actions = {
  exportCSV({}, { delimiter = ';', fileName = 'table' }) {
    let data = [];
    const rows = document.querySelectorAll('table tr');
    for (let i = 0; i < rows.length; i++) {
      let row = [];
      let cols = rows[i].querySelectorAll('td, th');
      for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }
      data.push(row.join(delimiter));
    }
    const csvData = new Blob([data.join('\n')], {
      type: 'text/csv;charset=utf-8'
    });
    const csvUrl = URL.createObjectURL(csvData);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
  }
};
