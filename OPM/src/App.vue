<template>
  <div id="app">
    <!--
      导航头部+log
    -->
    <el-header>
      <el-row :span="3">
        <el-col class="logcontMain" :span="3">
          <el-col class="grid-content bg-purple-dark logcont">Logo</el-col>
        </el-col>
        <el-col :span="3"></el-col>
        <el-col :span="4" :push="15">
          <div class="grid-content heaimg bg-purple-light">
            <el-col :span="4" style=" font-size:28px;">
              <i class="el-icon-bell"></i>
            </el-col>
            <el-col :span="4"></el-col>
            <el-col :span="4" :push="3">
              <el-dropdown trigger="click" @command="handleCommand">
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
          default-active="1-2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>应用管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-2">签名管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
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
      navtypesrc: "../static/image/navleft.png"
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
  background: #00284d;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  width: 100%;
}
.mainCont {
  background: #eeeeee;
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
