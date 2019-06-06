<template>
  <div id="app">
    <!--
      导航头部+log
    -->
    <el-header style="background-color: #23262e;height:61px;">
      <el-row :span="3">
        <el-col class="logcontMain" :span="3">
          <el-col class="grid-content bg-purple-dark logcont">O M S</el-col>
        </el-col>
        <el-col :span="3"></el-col>
        <el-col :span="4" :push="15">
          <div class="grid-content heaimg bg-purple-light">
            
            <el-col :span="4" :push="8">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <img src="../static/image/headimg.png" style="width:70%" alt>
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
          :default-active="routerpath"
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
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/">用户列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/oms-userlist">标签管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="21" class="mainCont">
        <el-scrollbar style="height:100%">
          <router-view></router-view>
        </el-scrollbar>
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
      activeIndex: 1,
      showpage: 0,
      routerpath: "/"
    };
  },
  created() {
    if (this.$route.path == "/oms-userinfo") {
      var urls = "/";
    } else if (this.$route.path == "/opma-dduser") {
      var urls = "/oms-userlist";
    } else {
      var urls = this.$route.path;
    }
    this.routerpath = urls;
  },
  watch: {
  },
  methods: {
    handleOpen(key, keyPath) {
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
#app .el-menu-vertical-demo:not(.el-menu--collapse) {
  height: 100%;
  width: 100%;
  min-height: 400px;
}
body,
#app .el-header {
  margin: 0;
  padding: 0;
}

#app .logcont {
  background: #23262e;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  width: 100%;
  color: #009688;
  font-size: 27px;
}
#app .mainCont {
  background: #dddddd;
  min-height: 500px;
}
#app .el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 500px;
  width: 100%;
}
#app .leftslide {
  height: 60px;
  line-height: 60px;
}
#app .leftslide img {
  margin-left: 20px;
  margin-top: 15px;
  width: 32px;
  height: 32px;
}
#app .el-menu--collapse {
  min-height: 500px;
}
#app .el-submenu .el-menu-item {
  min-width: auto;
}
#app .el-row {
  height: 100%;
}
#app .el-row > div {
  height: 100%;
}
#app .el-row .mainCont1 {
  height: auto;
}
#app .heaimg {
  line-height: 60px;
  text-align: center;
}
#app .heaimg img {
  vertical-align: middle;
}
</style>
