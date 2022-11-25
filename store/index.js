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
    { scope: 'selected-html', comment: 'Enabled selected from HTML' },
    { scope: 'channel:export:table', comment: 'Export channels in CSV file' },
    { scope: 'vpn:export:table', comment: 'Export VPNs in CSV file' },
    { scope: 'ipaddress:client:internet', comment: 'Show IP Addresses with Internet' },
    { scope: 'ipaddress:client:email', comment: 'Show IP Addresses with E-Mails' },
    { scope: 'ipaddress:export:table', comment: 'Export IP Addresses in CSV file' },
    { scope: 'ipaddress:export:internet', comment: 'Export IP with Internet to CSV file' },
    { scope: 'inspector:export:table', comment: 'Export PC SysInspector reports in CSV file' },
    { scope: 'logger:export:table', comment: 'Export logs in CSV file' },
    { scope: 'branch:find:all', comment: 'Select all branches from database' },
    { scope: 'branch:create:one', comment: 'Create branch in database' },
    { scope: 'branch:find:one', comment: 'Select one branch from database' },
    { scope: 'branch:update:one', comment: 'Update one branch in database' },
    { scope: 'branch:remove:one', comment: 'Remove one branch in database' },
    { scope: 'channel:find:all', comment: 'Select all channels from database' },
    { scope: 'channel:create:one', comment: 'Create channel in database' },
    { scope: 'channel:find:one', comment: 'Select one channel from database' },
    { scope: 'channel:update:one', comment: 'Update one channel in database' },
    { scope: 'channel:remove:one', comment: 'Remove one channel in database' },
    { scope: 'company:find:all', comment: 'Select all companies from database' },
    { scope: 'company:create:one', comment: 'Create company in database' },
    { scope: 'company:find:one', comment: 'Select one company from database' },
    { scope: 'company:update:one', comment: 'Update one company in database' },
    { scope: 'company:remove:one', comment: 'Remove one company in database' },
    { scope: 'department:find:all', comment: 'Select all departments from database' },
    { scope: 'department:create:one', comment: 'Create department in database' },
    { scope: 'department:find:one', comment: 'Select one department from database' },
    { scope: 'department:update:one', comment: 'Update one department in database' },
    { scope: 'department:remove:one', comment: 'Remove one department in database' },
    { scope: 'enterprise:find:all', comment: 'Select all enterprises from database' },
    { scope: 'enterprise:create:one', comment: 'Create enterprise in database' },
    { scope: 'enterprise:find:one', comment: 'Select one enterprise from database' },
    { scope: 'enterprise:update:one', comment: 'Update one enterprise in database' },
    { scope: 'enterprise:remove:one', comment: 'Remove one enterprise in database' },
    { scope: 'event:find:all', comment: 'Select all events from database' },
    { scope: 'event:create:one', comment: 'Create event in database' },
    { scope: 'event:find:one', comment: 'Select one event from database' },
    { scope: 'event:update:one', comment: 'Update one event in database' },
    { scope: 'event:remove:one', comment: 'Remove one event in database' },
    { scope: 'inspector:find:all', comment: 'Select all SysInspectors from database' },
    { scope: 'inspector:find:one', comment: 'Select one SysInspector from database' },
    { scope: 'inspector:remove:one', comment: 'Remove one inspector in database' },
    { scope: 'ipaddress:find:all', comment: 'Select all ipaddresses from database' },
    { scope: 'ipaddress:create:one', comment: 'Create ipaddress in database' },
    { scope: 'ipaddress:find:one', comment: 'Select one ipaddress from database' },
    { scope: 'ipaddress:update:one', comment: 'Update one ipaddress in database' },
    { scope: 'ipaddress:remove:one', comment: 'Remove one ipaddress in database' },
    { scope: 'ipaddress:search:one', comment: 'Search one ipaddress from database' },
    { scope: 'location:find:all', comment: 'Select all locations from database' },
    { scope: 'location:create:one', comment: 'Create location in database' },
    { scope: 'location:find:one', comment: 'Select one location from database' },
    { scope: 'location:update:one', comment: 'Update one location in database' },
    { scope: 'location:remove:one', comment: 'Remove one location in database' },
    { scope: 'logger:find:all', comment: 'Select all logs from database' },
    { scope: 'logger:remove:all', comment: 'Remove all logs in database' },
    { scope: 'notification:find:all', comment: 'Select all notifications from database' },
    { scope: 'notification:create:many', comment: 'Create many notification in database' },
    { scope: 'notification:remove:one', comment: 'Remove one notification in database' },
    { scope: 'position:find:all', comment: 'Select all positions from database' },
    { scope: 'position:create:one', comment: 'Create position in database' },
    { scope: 'position:find:one', comment: 'Select one position from database' },
    { scope: 'position:update:one', comment: 'Update one position in database' },
    { scope: 'position:remove:one', comment: 'Remove one position in database' },
    { scope: 'request:find:all', comment: 'Select all requests from database' },
    { scope: 'request:create:one', comment: 'Create request in database' },
    { scope: 'request:find:one', comment: 'Select one request from database' },
    { scope: 'request:update:one', comment: 'Update one request in database' },
    { scope: 'request:remove:one', comment: 'Remove one request in database' },
    { scope: 'statistic:ipaddress', comment: 'Select statistic of ipaddress' },
    { scope: 'statistic:inspector', comment: 'Select statistic of SysInspector' },
    { scope: 'statistic:request', comment: 'Select statistic of requests' },
    { scope: 'statistic:dashboard', comment: 'Select statistic for dashboard' },
    { scope: 'tool:get:inspector', comment: 'Tool SysInspector' },
    { scope: 'tool:get:rdp', comment: 'Tool RDP' },
    { scope: 'tool:get:vnc', comment: 'Tool VNC' },
    { scope: 'tool:get:ping', comment: 'Tool PING' },
    { scope: 'tool:get:oping', comment: 'Tool online PING' },
    { scope: 'unit:find:all', comment: 'Select all units from database' },
    { scope: 'unit:create:one', comment: 'Create unit in database' },
    { scope: 'unit:find:one', comment: 'Select one unit from database' },
    { scope: 'unit:update:one', comment: 'Update one unit in database' },
    { scope: 'unit:remove:one', comment: 'Remove one unit in database' },
    { scope: 'user:find:all', comment: 'Select all users from database' },
    { scope: 'user:create:one', comment: 'Create user in database' },
    { scope: 'user:find:one', comment: 'Select one user from database' },
    { scope: 'user:update:one', comment: 'Update one user in database' },
    { scope: 'user:remove:one', comment: 'Remove one user in database' },
    { scope: 'vpn:find:all', comment: 'Select all vpns from database' },
    { scope: 'vpn:create:one', comment: 'Create vpn in database' },
    { scope: 'vpn:find:one', comment: 'Select one vpn from database' },
    { scope: 'vpn:update:one', comment: 'Update one vpn in database' },
    { scope: 'vpn:remove:one', comment: 'Remove one vpn in database' }
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
