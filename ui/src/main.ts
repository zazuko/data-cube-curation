import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from './router'
import store from './store'
import VueHighlightJS from 'vue-highlightjs'
import MultiSelect from 'vue-multiselect'
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'

import { library as iconsLibrary } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'buefy/dist/buefy.css'
import 'highlight.js/styles/github-gist.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import './styles/variables.css'
import './styles/multiselect.css'
import './styles/dropdown.css'

iconsLibrary.add(fas)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

Vue.component('MultiSelect', MultiSelect)

Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultIconComponent: 'FontAwesomeIcon',
})

Vue.use(VueHighlightJS)

Vue.config.productionTip = false

Vue.filter('capitalize', ([first, ...rest]: string): string => [first.toLocaleUpperCase(), ...rest].join(''))

router.beforeEach(vuexOidcCreateRouterMiddleware(store))

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
