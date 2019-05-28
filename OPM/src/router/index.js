import Vue from 'vue';
import Router from 'vue-router';
import loginPage from '@/components/login-page';
import ompPublish from '@/components/OMP-manage/omp-publish';

import ompuserlist from '@/components/OMP-manage/omp-userlist';
import opmadduser from '@/components/OMP-manage/opm-adduser';

import opmuserinfo from '@/components/OMP-manage/opm-userinfo';
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      name:'index',
      component: ompPublish
    },
    {
      path: '/login',
      name: 'loginPage',
      component: loginPage
    },{
      path: '/omp-userlist',
      name: 'ompuserlist',
      component: ompuserlist
    },{
      path: '/opma-dduser',
      name: 'opmadduser',
      component: opmadduser
    },{
      path: '/opma-userinfo',
      name: 'opmuserinfo',
      component: opmuserinfo
    },
  ]
})

// router.beforeEach((to, from, next) => {
//   let userInfo=localStorage.getItem('userInfo');
//   if(userInfo!=null){
//     if(Date.now()-JSON.parse(userInfo).loginTime<=3600*1000){
//       next({path:to.path=='/login'?'/video-center':null});
//     }else {
//       localStorage.removeItem('userInfo');
//       next({path:to.path=='/login'?null:'/login'});
//     }
//   }else {
//     next({path:to.path=='/login'?null:'/login'});
//   }
// });

export default router;
