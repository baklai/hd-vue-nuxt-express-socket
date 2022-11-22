import dirtree from 'directory-tree';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { config } from './package.json';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '.env.prod')
      : path.join(__dirname, '.env.dev')
});

export default {
  telemetry: false,
  ssr: true,

  cli: {
    badgeMessages: [
      `Application: ${process.env.npm_package_name.toUpperCase()}`,
      `Version:     ${process.env.npm_package_version}`
    ],
    bannerColor: 'blue'
  },

  publicRuntimeConfig: {
    fileHosting:
      dirtree('./static/docs', {
        extensions: /\.(md|pdf|png|txt|xls|doc|docx|zip|rar|cab|exe|msi)$/,
        attributes: ['size', 'type', 'extension', 'atime', 'mtime', 'ctime', 'birthtime'],
        normalizePath: true
      }) || null
  },

  server: {
    port: process.env.NODE_ENV === 'production' ? 443 : 3000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    https:
      process.env.NODE_ENV === 'production'
        ? {
            key: fs.readFileSync(path.resolve(__dirname, 'certs', 'server.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'server.crt'))
          }
        : false
  },

  router: {
    prefetchLinks: false
  },

  head: {
    titleTemplate: `${config.app.short_name} • %s`,
    title: config.app.name,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: config.app.description
      },
      { name: 'google', content: 'notranslate' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  components: true,

  loading: {
    color: '#2196F3',
    height: '2px'
  },

  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/variables.css',
    '~/assets/vuetify.css'
  ],

  plugins: ['~/plugins/clipboard.client', '~/plugins/theme.client', '~/plugins/helpdesk.client'],

  buildModules: ['@nuxtjs/vuetify'],

  modules: [
    'nuxt-route-meta',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/toast'
  ],

  axios: {
    proxy: true,
    prefix: '/api/v1/',
    credentials: true,
    https: process.env.NODE_ENV === 'production' ? true : false
  },

  content: {
    apiPrefix: 'content'
  },

  auth: {
    cookie: false,
    resetOnError: true,
    watchLoggedIn: true,
    localStorage: false,
    rewriteRedirects: true,
    redirect: {
      home: '/#welcome-to-helpdesk',
      login: '/#signin-to-helpdesk',
      logout: '/#see-you-helpdesk',
      callback: false
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'accessToken',
          global: true
        },
        refreshToken: {
          property: 'refreshToken',
          data: 'refreshToken'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/auth/signin', method: 'post' },
          logout: { url: '/auth/signout', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          user: { url: '/auth/me', method: 'get' }
        },
        autoLogout: true
      }
    },
    plugins: ['~/plugins/has-scope.client.js']
  },

  i18n: {
    lazy: true,
    langDir: 'lang/',
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.json',
        name: 'English'
      },
      {
        code: 'ru',
        iso: 'ru-RU',
        file: 'ru-RU.json',
        name: 'Русский'
      },
      {
        code: 'uk',
        iso: 'uk-UA',
        file: 'uk-UA.json',
        name: 'Українська'
      }
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'app.lang',
      redirectOn: 'root'
    },
    vueI18n: {
      fallbackLocale: 'en'
    }
  },

  toast: {
    type: 'default',
    theme: 'toasted-primary',
    position: 'bottom-right',
    icon: 'alert-circle-outline',
    duration: 3000,
    iconPack: 'mdi',
    register: [
      {
        name: 'error',
        message: 'Oops... Something went wrong!',
        options: {
          type: 'error',
          duration: 5000
        }
      }
    ]
  },

  vuetify: {
    font: {
      family:
        '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif'
    },
    icons: {
      iconfont: 'mdi'
    },
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      options: {
        customProperties: true
      },
      themes: {
        light: {
          background: '#FFFFFF',
          themecolor: '#FFFFFF',
          scrollbar: '#FFFFFF',
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          thover: '#FAFAFA'
        },
        dark: {
          background: '#333333',
          themecolor: '#333333',
          scrollbar: '#333333',
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          thover: '#424242'
        }
      }
    }
  },

  serverMiddleware: [
    {
      path: '/api/v1',
      handler: '~/api/index.js',
      prefix: false
    }
  ],

  build: {
    publicPath: 'cdn/'
  }
};
