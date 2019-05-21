// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/lib/iconfont.css'
import './assets/lib/font/iconfont.css'
import './assets/lib/index.css'
//import '../sk-theme/lib/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.use(element)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
