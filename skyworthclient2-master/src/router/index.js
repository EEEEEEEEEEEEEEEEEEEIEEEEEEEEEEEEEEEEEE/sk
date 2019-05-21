import Vue from 'vue'
import Router from 'vue-router'
import homepage from '@/components/homepage'
import listpage from '@/components/listpage'
//const homepage = () => import('@/components/homepage')
//const listpage = () => import('@/components/listpage')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: homepage
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: homepage
    },
    {
      path: '/listpage',
      name: 'listpage',
      component: listpage
    }
  ]
})
