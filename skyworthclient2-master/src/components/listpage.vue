<template>
  <div class="listpage">
    <div class="listpage__main">
      <ef-list style="width: 100%;height: 100%;" :wrap-height="'100%'" :list="deviceList">
        <el-row class="listpage-listitem animated fadeIn" v-for="(device,index) in deviceList" :key="index">
          <el-col :span="6" :xs="3" style="display: flex;align-items: center">
            <i class="sk-icon-device listpage-listitem__device-logo"></i>
            <span>{{device.Id}}</span>
          </el-col>
          <el-col :span="6" :xs="8">
            <span class="listpage-listitem__playState" style="margin-right: 0.5rem">{{device.connectState==1?"已连接":"未连接"}}</span>
            <span class="listpage-listitem__playState">{{device.playerState==1?"正在播放":"未播放"}}</span>
          </el-col>
          <el-col :span="5" :xs="2" style="display: flex;justify-content: space-evenly">
            <i class="sk-icon-battery" :class="['listpage-listitem__battery','is-'+device.powerState]"></i>
            <svg class="listpage-listitem__wifi-signal">
              <use :href="'#sky-icon-ic_signal_wifi'+device.signalIndex"></use>
            </svg>
          </el-col>
          <el-col :span="7" :xs="11" style="display: flex;justify-content: center">
            <span style="color: #999999">{{device.SerialNumber}}</span>
          </el-col>
          <el-col :span="1" :xs="1">
            <el-button type="text" style="color: gray;font-size: 1rem" @click="toggleSameScreen(device)"
                       :class="{'is-playScreen':device.playSameScreen}">同屏
            </el-button>
          </el-col>
        </el-row>
      </ef-list>
    </div>
    <div class="listpage-footer">
      <div class="listpage-footer__button" @click="turnoffAll">
        <i class="sk-icon-poweroff listpage-footer__buttonIcon"></i>
        全部关机
      </div>
      <div class="listpage-footer__button" @click="rebootAll">
        <i class="sk-icon-reboot listpage-footer__buttonIcon"></i>
        全部重启
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import EfList from "./common/ef-list/list";
  import icon from '../assets/lib/iconfont'

  export default {
    name: "listpage",
    data() {
      return {}
    },
    methods: {
      turnoffAll() {
        this.wsAdmin.send(JSON.stringify({
          Type: 1, AdminEvent: {
            Control: 10,      //10表示关机
            Resource: null
          }
        }));
      },
      rebootAll() {
        this.wsAdmin.send(JSON.stringify({
          Type: 1, AdminEvent: {
            Control: 20,      //10表示关机
            Resource: null
          }
        }));
      },
      toggleSameScreen(device) {
        let formData = new FormData();
        formData.set('sn', device.SerialNumber);
        this.axios.post('/ccweb/api/setquaternionsyncdevice', formData).then((res) => {
          if (res.data.Code == 0) {
            this.deviceList.forEach((device) => {
              device.playSameScreen = false;
            });
            device.playSameScreen = true;
            this.updateDeviceList(this.deviceList);
          }
          if (res.data.Code == -1) {
            this.$message({
              message: '设备未连接！',
              type: 'warning',
              duration: 1500
            });
          }
        });
      },
      ...mapMutations({
        updateDeviceList: 'wsData/updateDeviceList'
      }),
    },
    computed: {
      ...mapState({
        deviceList: state => state.wsData.deviceList,
        wsAdmin: state => state.wsData.wsAdmin
      }),
    },
    components: {EfList}
  }
</script>

<style scoped>
  .is-playScreen {
    color: #3a8ee6 !important;
  }
</style>
