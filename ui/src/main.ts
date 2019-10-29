import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from './router'
import store from './store'

import 'buefy/dist/buefy.css'

Vue.use(Buefy)

Vue.config.productionTip = false
Vue.config.ignoredElements = [
  'alcaeus-form'
]

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
