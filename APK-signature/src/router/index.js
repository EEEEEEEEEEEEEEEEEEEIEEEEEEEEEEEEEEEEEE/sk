import Vue from 'vue';
import Router from 'vue-router';
import loginPage from '@/components/login-page';
import apkupdata from '@/components/APK-signature/apk-updata';

import apkhistory from '@/components/APK-signature/apk-history';
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      name:'index',
      component: apkupdata
    },
    {
      path: '/login',
      name: 'loginPage',
      component: loginPage
    },
    {
      path: '/apkhistory',
      name: 'apkhistory',
      component: apkhistory
    }
  ]
})

router.beforeEach((to, from, next) => {
  let userInfo=localStorage.getItem('userInfo');
  if(userInfo!=null){
    if(Date.now()-JSON.parse(userInfo).loginTime<=3600*1000){
      next({path:to.path=='/login'?'/video-center':null});
    }else {
      localStorage.removeItem('userInfo');
      next({path:to.path=='/login'?null:'/login'});
    }
  }else {
    next({path:to.path=='/login'?null:'/login'});
  }
});

export default router;
