<template>
  <div id="app">
    <!--
      导航头部+log
    -->
    <el-header style="background-color: #23262e;height:61px;">
      <el-row :span="3">
        <el-col class="logcontMain" :span="3">
          <el-col class="grid-content bg-purple-dark logcont">SkyworthVR</el-col>
        </el-col>
        <el-col :span="3"></el-col>
        <el-col :span="4" :push="15">
          <div class="grid-content heaimg bg-purple-light">
            <el-col :span="4" :push="5" style=" font-size:24px;vertical-align: sub;color:#009688">
              <i class="el-icon-bell"></i>
            </el-col>
            <el-col :span="4"></el-col>
            <el-col :span="4" :push="5">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <img src="../static/image/headimg.png" alt>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">登出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-row class="tac">
      <el-col :span="3">
        <el-menu
          default-active="/"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          @select="handleSelect"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>应用管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/">APK签名</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/apkhistory">签名历史</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          
        </el-menu>
      </el-col>
      <el-col :span="21" class="mainCont">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      navtypesrc: "../static/image/navleft.png",
      activeIndex: 1
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(this.navtypesrc);
    },
    handleOpennav() {
      if (this.isCollapse == true) {
        this.isCollapse = false;
        this.navtypesrc = "../static/image/navleft.png";
      } else {
        this.isCollapse = true;
        this.navtypesrc = "../static/image/navleftopen.png";
      }
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      localStorage.removeItem("userInfo");
      this.$router.push("/login");
      /*this.axios.get('/ssnwtweb/api/admins/logout').then((res)=>{

        });*/
    },
    handleCommand(command) {
      localStorage.removeItem("userInfo");
      this.$router.push("/login");
      /*this.axios.get('/ssnwtweb/api/admins/logout').then((res)=>{

        });*/
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.$router.push(key);
    }
  }
};
</script>
<style>
body,
html {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body,
html,
div {
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  height: 100%;
  width: 200px;
  min-height: 400px;
}
body,
.el-header {
  margin: 0;
  padding: 0;
}
.logcont {
    background: #23262E;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    width: 100%;
    color: #009688;
    font-size: 27px;
}
.mainCont {
  background: #dddddd;
  min-height: 500px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 500px;
  width: 100%;
}
.leftslide {
  height: 60px;
  line-height: 60px;
}
.leftslide img {
  margin-left: 20px;
  margin-top: 15px;
  width: 32px;
  height: 32px;
}
.el-menu--collapse {
  min-height: 500px;
}
#app .el-submenu .el-menu-item {
  min-width: auto;
}
.el-row {
  height: 100%;
}
.el-row > div {
  height: 100%;
}
.mainContdiv {
  height: 100%;
}
.heaimg {
  line-height: 60px;
  text-align: center;
}
.heaimg img {
  vertical-align: middle;
}
</style>
