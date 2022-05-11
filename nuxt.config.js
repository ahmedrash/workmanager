import colors from 'vuetify/es5/util/colors'

require('dotenv').config()

var fs = require('fs')
var path = require('path')


let port = 3000
let host = '127.0.0.1'
let https = false

export default {
  server: {
    port: port,
    host: host,
    timing: false,
    https: https
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Work Manager',
    title: 'Dynamicflow',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Dynamicflow - Work Manager is a productivity application' },
      { name: 'format-detection', content: 'telephone=no' },
      {property: 'og:title', content: 'Work Manager'},
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://wm.dynamicflowit.com'},
      {property: 'og:image', content: 'https://wm.dynamicflowit.com/Asset 2@300x.png'},
      {property: 'og:description', content: 'Dynamicflow - Work Manager is a productivity application'},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/Asset 2@300x.png' },
    ]
  },
  loading: {
    color: '#000000',
    height: '3px',
    throttle: 500,
    duration: 5000,
    continuous: false
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.css',
    'remixicon/fonts/remixicon.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/idle.js', mode: 'client' },
    '~/plugins/Axios.js',
    { src: '~plugins/roles' },
    { src: '~plugins/maz-ui', ssr: false },
    '~/plugins/dateformat.js',
    '~plugins/tiptap.js',
    '~plugins/file-upload.js',
    '~plugins/chat-scroll.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'nuxt-vuex-localstorage',
    'nuxt-clipboard2'
  ],
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // proxy: true
    // And setup our base API url so axios knows to always use this
    baseURL: process.env.apiUrl,
    // proxy: true
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#344e5c",
          accent: "#4ab19d",
          secondary: "#4d5e72",
          info: "#9bd7d1",
          warning: "#efc958",
          error: "#ef3d59",
          success: "#1DB954"
        },
        light: {
          primary: "#344e5c",
          accent: "#4ab19d",
          secondary: "#4d5e72",
          info: "#9bd7d1",
          warning: "#efc958",
          error: "#ef3d59",
          success: "#1DB954"
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        [
          'component', {
            libraryName: 'maz-ui',
            styleLibraryName: 'css'
          }
        ]
      ]
    },
    extend (config, ctx) {
    },
    terser: {
      terserOptions: {
        compress: {
          // pure_funcs: ['console.log', 'console.debug', 'console.warn', 'console.error']
        }
      }
    },
    maxChunkSize: 300000
  }
}
