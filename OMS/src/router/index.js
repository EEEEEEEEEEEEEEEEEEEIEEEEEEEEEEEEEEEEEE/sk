/* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
import loginPage from '@/components/login-page';
import omsPublish from '@/components/OMS-manage/oms-publish';
import omsuserlist from '@/components/OMS-manage/oms-userlist';
import opmadduser from '@/components/OMS-manage/opm-adduser';

import omsserinfo from '@/components/OMS-manage/oms-userinfo';
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path:'/',
      name:'index',
      component: omsPublish
    },
    {
      path: '/login',
      name: 'loginPage',
      component: loginPage
    },{
      path: '/oms-userlist',
      name: 'omsuserlist',
      component: omsuserlist
    },{
      path: '/opma-dduser',
      name: 'opmadduser',
      component: opmadduser
    },{
      path: '/oms-userinfo',
      name: 'omsserinfo',
      component: omsserinfo
    },
  ]
});

router.beforeEach((to, from, next) => {
  let userInfo=localStorage.getItem('userInfo');
  if(userInfo!=null){
    console.log(Date.now()-JSON.parse(userInfo).loginTime<=3600*10000)
    if(Date.now()-JSON.parse(userInfo).loginTime<=3600*10000){
      next({path:to.path=='/login'?'/omp-userlist':null});
    }else {
      localStorage.removeItem('userInfo');
      next({path:to.path=='/login'?null:'/login'});
    }
  }else {
    next({path:to.path=='/login'?null:'/login'});
  }
});

export default router;
