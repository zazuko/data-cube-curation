import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from './router'
import store from './store'
import VueHighlightJS from 'vue-highlightjs'

import { library as iconsLibrary } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'buefy/dist/buefy.css'
import 'highlight.js/styles/github-gist.css'

iconsLibrary.add(fas)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultIconComponent: 'FontAwesomeIcon'
})

Vue.use(VueHighlightJS)

Vue.config.productionTip = false

Vue.filter('capitalize', ([first, ...rest]: string): string => [first.toLocaleUpperCase(), ...rest].join(''))

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
