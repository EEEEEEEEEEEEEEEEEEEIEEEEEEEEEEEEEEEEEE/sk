<template>
  <el-row id="app">
    <el-col :span="20" class="app-main">
      <router-view></router-view>
    </el-col>
    <el-col :span="4" class="app-sidebar">
      <div class="app-sidebar__toggleButtonGroup">
        <div class="app-sidebar__toggleButton" :class="{'is-active':toggles[0].active}"
             @click="toggleRouter(toggles[0].link)">
          <i class="sk-icon-home"></i>
        </div>
        <div class="app-sidebar__toggleButton" :class="{'is-active':toggles[1].active}"
             @click="toggleRouter(toggles[1].link)">
          <i class="sk-icon-device"></i>
        </div>
      </div>
      <div class="app-sidebar__battery-group">
          <span v-for="battery in batteries">
            <i class="sk-icon-battery app-sidebar__battery-icon" :class="['is-'+battery.status]"></i>
            {{battery.size}}
          </span>
      </div>
      <div class="app-sidebar__device-info">
        <div>已注册设备：{{deviceInfo.registered}}</div>
        <div>已连接：{{deviceInfo.connected}}</div>
        <div>已进入：{{deviceInfo.entered}}</div>
      </div>
      <div class="app-sidebar__playButton" @click="videoNetPlay()">
        <i :class="[{'sk-icon-netplay':netPlayState==0?true:false,'sk-icon-netreturn':netPlayState==1?true:false}]"
           class="app-sidebar__playButtonIcon"></i>
        {{netPlayState==0?"全网播放":"继续播放"}}
      </div>
      <div class="app-sidebar__playButton is-dark" @click="videoLocalPlay">
        <i class="sk-icon-localplay app-sidebar__playButtonIcon"></i>
        本地播放
      </div>
    </el-col>
    <div v-if="showVideo" class="app-video">
      <video id="my-video" class="video-js vjs-big-play-centered" preload="undefined" :loop="loopPlay"
             crossorigin="anonymous" autoplay :controls="isLocalPlay" webkit-playsinline="true" playsinline="true">
        <source :src="isLocalPlay==true?curUri:curNetPlayResource.UriLowRes" type="video/mp4"/>
      </video>
      <div class="app-video__header-container" @click="showVideoHeader">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div class="app-video__header" v-if="videoHeaderVisible">
            <i class="close-video sk-icon-return" @click="videoClose" v-if="isLocalPlay"></i>
            <div class="net-exit" @click="netPlayClose" v-if="!isLocalPlay">全网退出</div>
          </div>
        </transition>
      </div>
      <div class="app-video__bottombar-container" @click="showVideoHeader" v-if="!isLocalPlay">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <el-row class="app-video__bottombar" v-if="videoHeaderVisible" @click="showVideoHeader">
            <el-col :span="1" :xs="2" style="display: flex;justify-content: center">
              <i class="font_family" style="color: white;font-size: 15px;cursor: pointer;"
                 :class="[{'sky-icon-play':!isVideoPlaying,'sky-icon-pause':isVideoPlaying}]"
                 @click="videoPlayControl"></i>
            </el-col>
            <el-col :span="22" :xs="20" style="display: flex;align-items: center;position: relative;height: 100%">
              <div style="position:absolute;width: 100%;height: 5px;background-color: white;"></div>
              <div style="position: absolute;background-color: #3a8ee6;height:5px;transition: .25s all linear;width: 0%"
                   :style="{width:curVideoInfo.CurWidth*100+'%',transition:videoProgressTransition==true?'.25s all linear':null}"></div>
              <div style="font-size: 0.7rem;color: white;position: absolute;bottom: 0px;left: 0">
                {{curVideoInfo.CurTime}}
              </div>
              <div style="font-size: 0.7rem;color: white;position: absolute;bottom: 0px;right: 0">
                {{curVideoInfo.Duration}}
              </div>
            </el-col>
            <el-col :span="1" :xs="2" style="display: flex;justify-content: center">
              <i class="font_family sky-icon-xunhuanbofang" style="color: white;font-size: 30px;cursor: pointer;"
                 @click="videoLoopPlay"
                 :style="{color:loopPlay?'#3a8ee6':'white'}"></i>
            </el-col>
          </el-row>
        </transition>
      </div>
    </div>
  </el-row>
</template>

<script>
  import {mapMutations} from 'vuex'
  import videojs from 'video.js'
  import videojsvr from 'videojs-vr'
  import {mapState} from 'vuex'
  import screenfull from 'screenfull'
  import * as THREE from 'three';

  var qte = require('quaternion-to-euler');

  export default {
    name: 'App',
    data() {
      return {
        toggles: [],
        batteries: [],
        deviceInfo: {},
        wsAdmin: {},
        heartCheck: {},
        lockReconnect: false,
        showVideo: false,
        netPlayState: 0,    //0-play stopped  1-is playing
        curTime: "",
        isLocalPlay: false,
        curNetPlayResource: "",
        lastTimeStamp: "",
        videoHeaderVisible: true,
        videoPlayedFinished: false,
        userActivity: false,
        inactivityTimeout: null,
        activityCheckInterval: null,
        isVideoPlaying: false,
        curVideoInfo: {},
        videoProgressTransition: true,
        loopPlay: false,
        angle: 0,
        userQuaternionEvent: {}
      }
    },
    created() {
      this.init();
      this.$message({
        message: '双击屏幕可进入全屏模式！'
      });
      this.$nextTick(() => {
        let goFS = document.getElementById("app");
        goFS.addEventListener("dblclick", () => {
          this.toggleFullScreen();
        }, false);
      });
    },
    methods: {
      init() {
        let vue = this;
        this.heartCheck = {
          timeout: 6000,
          timeoutObj: null,
          reset() {
            clearTimeout(this.timeoutObj);
            this.start();
          },
          start() {
            this.timeoutObj = setTimeout(() => {
              vue.wsAdmin.close();
            }, this.timeout);
          }
        }
        this.curVideoInfo = {
          Duration: "",
          CurTime: "",
          CurWidth: "",
          CurRealTime: ""
        }
        let currentPath = this.$router.currentRoute.path;
        let toggles = [
          {active: false, link: 'homepage'},
          {active: false, link: 'listpage'}
        ]
        if (currentPath == '/homepage' || currentPath == '/') {
          toggles[0].active = true;
        } else {
          toggles[1].active = true;
        }
        this.toggles = toggles;
        this.fetchData();
      },

      enterFullScreen() {
        let doc = window.document;
        let docEl = doc.documentElement;

        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
          requestFullScreen.call(docEl);
        }
      },

      toggleFullScreen() {
        let doc = window.document;
        let docEl = doc.documentElement;

        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
          requestFullScreen.call(docEl);
        } else {
          cancelFullScreen.call(doc);
        }
      },

      //从服务器上获取
      fetchData() {
        this.connectServerByWS();
        this.deviceInfo = {
          registered: 0,
          booted: 0,
          connected: 0,
          entered: 0
        }
        this.axios.get("/ccweb/api/devices/list").then((res) => {
          this.deviceInfo.registered = res.data.length;
          let deviceList = [];
          res.data.forEach((device) => {
            deviceList.push({
              signalIndex: "",
              powerState: 'Empty',
              Id: device.Id,
              SerialNumber: device.SerialNumber,
              playerState: 0,
              connectState: 0,
              playSameScreen: false
            });
          });
          this.updateDeviceList(deviceList);
        });
        let batteryFull = {
          size: 0,
          status: "full"
        }
        let batteryEnough = {
          size: 0,
          status: "enough"
        }
        let batteryEmpty = {
          size: 0,
          status: "empty"
        }
        this.batteries.push(batteryFull);
        this.batteries.push(batteryEnough);
        this.batteries.push(batteryEmpty);
      },
      async connectServerByWS() {
        try {
          let url = window.location.host;
          /*await this.axios.get('/static/config/servercfg.ini').then((res) => {
            url = res.data.Addr;
          });*/
          let timeStamp = new Date().getTime();
          this.wsAdmin = new WebSocket("ws://" + url + "/ccweb/ws/join?sn=admin" + timeStamp);
          this.setwsAdmin(this.wsAdmin);
          this.wsAdmin.onopen = (evt) => {
            //this.heartCheck.start();
          }
          this.wsAdmin.onmessage = (evt) => {
            let message = JSON.parse(evt.data);
            if (message.Type == 3) {
              let UserEvents = message.Data.UserEvents;
              this.updateUserEvents(UserEvents);
              this.setDeviceListByUserEvents(UserEvents);
              this.flushDevicesStatus(UserEvents);
            }
            if (message.Type == 6) {
              this.userQuaternionEvent = message.Data;
              if (this.showVideo) {
                let player = videojs('my-video');
                let quaternionLeftHand = new THREE.Quaternion(this.userQuaternionEvent.X, this.userQuaternionEvent.Y, this.userQuaternionEvent.Z, this.userQuaternionEvent.W);
                let quaternionRightHand = new THREE.Quaternion(quaternionLeftHand.z, -quaternionLeftHand.w, quaternionLeftHand.x, quaternionLeftHand.y);
                let rotation = new THREE.Euler().setFromQuaternion(quaternionRightHand, "ZXY");
                if (player.vr().camera != undefined) {
                  player.vr().camera.position.x = 2 * Math.sin(-rotation.y) * Math.cos(-rotation.x);
                  player.vr().camera.position.y = 2 * Math.sin(-rotation.x);
                  player.vr().camera.position.z = 2 * Math.cos(-rotation.y) * Math.cos(-rotation.x);
                }
              }
              //console.log(this.userQuaternionEvent);
            }
            this.wsAdmin.send('OK');
            //this.heartCheck.reset();
          }
          this.wsAdmin.onclose = (evt) => {
            this.wsReconnect();
            console.log("websocket closed");
          }
          this.wsAdmin.onerror = (evt) => {
            this.wsReconnect();
            console.log("websocket error");
          }
        } catch (e) {
          this.wsReconnect();
        }
      },
      setDeviceListByUserEvents(UserEvents) {
        let deviceList = this.deviceList;
        let updatedDeviceList = [];
        UserEvents.forEach((userevent) => {
          let signalIndex = 0;
          let powerState = "";
          let playerState = userevent.playerState;
          if (userevent.PowerState <= 30) {
            powerState = 'nearEmpty';
          } else if (userevent.PowerState > 30 && userevent.PowerState <= 70) {
            powerState = 'enough';
          } else {
            powerState = 'full';
          }
          if (userevent.SignalStrength == 0) {
            signalIndex = 0;
          } else if (userevent.SignalStrength <= 25) {
            signalIndex = 1;
          } else if (userevent.SignalStrength > 25 && userevent.SignalStrength <= 50) {
            signalIndex = 2;
          } else if (userevent.SignalStrength > 75 && userevent.SignalStrength <= 100) {
            signalIndex = 3;
          } else {
            signalIndex = 4;
          }
          updatedDeviceList.push({
            Id: userevent.UserDevice.Id,
            SerialNumber: userevent.UserDevice.SerialNumber,
            signalIndex: signalIndex,
            playerState: playerState,
            powerState: powerState,
            connectState: 1,
          })
        });
        deviceList.forEach((device) => {
          let i = 0;
          for (; i < updatedDeviceList.length; i++) {
            if (device.Id == updatedDeviceList[i].Id) {
              device.signalIndex = updatedDeviceList[i].signalIndex;
              device.powerState = updatedDeviceList[i].powerState;
              device.playerState = updatedDeviceList[i].playerState;
              device.connectState = 1;
              break;
            }
          }
          if (i == updatedDeviceList.length) {       //表示循环出去，device状态未发送过来
            device.signalIndex = "";
            device.powerState = 'Empty';
            device.playerState = 0;
            device.connectState = 0;
          }
        });
        this.updateDeviceList(deviceList);
      },
      wsReconnect() {
        if (this.lockReconnect) return;
        this.lockReconnect = true;
        setTimeout(() => {
          this.connectServerByWS();
          this.lockReconnect = false;
        }, 2000);
      },
      flushDevicesStatus(UserEvents) {
        //initState
        this.deviceInfo.booted = this.deviceInfo.connected = this.deviceInfo.entered = 0;
        this.batteries.forEach((battery) => {
          battery.size = 0;
        })
        //flushState
        UserEvents.forEach((userevent) => {
          if (userevent.PowerState <= 30) {
            this.batteries[2].size++;
          } else if (userevent.PowerState > 30 && userevent.PowerState <= 70) {
            this.batteries[1].size++;
          } else {
            this.batteries[0].size++;
          }
          if (userevent.PlayerState == 1) {
            this.deviceInfo.entered++;
          }
          this.deviceInfo.connected++;
        });
      },
      toggleRouter(link) {
        if (link == 'homepage') {
          this.toggles[0].active = true;
          this.toggles[1].active = false;
          this.$router.push('/homepage');
        } else {
          this.toggles[1].active = true;
          this.toggles[0].active = false;
          this.$router.push('/listpage');
        }
      },
      videoPlayControl() {
        let myPlayer = videojs('my-video');
        if (!this.isVideoPlaying) {
          if (this.curVideoInfo.CurWidth == 1) {
            this.videoProgressTransition = false;
            this.curVideoInfo.CurWidth == 0;
            setTimeout(() => {
              this.videoProgressTransition = true;
            }, 100);
          }
          myPlayer.play();
          this.isVideoPlaying = true;
        } else {
          myPlayer.pause();
          this.isVideoPlaying = false;
        }
      },
      videoLoopPlay() {
        let myPlayer = videojs('my-video');
        if (this.loopPlay) {
          this.loopPlay = false;
        } else {
          if (this.curVideoInfo.CurWidth == 1) {
            this.videoProgressTransition = false;
            this.curVideoInfo.CurWidth == 0;
            setTimeout(() => {
              this.videoProgressTransition = true;
            }, 100);
          }
          myPlayer.play();
          this.isVideoPlaying = true;
          this.loopPlay = true;
        }
      },
      videoNetPlay() {
        if (!this.resourceSelected && this.netPlayState == 0) {
          const h = this.$createElement;
          this.$message({
            message: h('p', null, [
              h('span', null, '请先选择视频! '),
            ]),
            center: true
          });
          return;
        } else if (this.netPlayState == 0) {              //全网刚刚开始播放
          this.netPlayState = 1;
          //this.curNetPlayResource=this.curResource;
          this.curNetPlayResource = JSON.parse(JSON.stringify(this.curResource));
          this.curTime = 0;
          this.lastTimeStamp = new Date().getTime();
          this.wsAdmin.send(JSON.stringify({
            Type: 1, Data: {
              Control: 1,      //1表示播放
              Resource: this.curNetPlayResource
            }
          }));
        }
        this.isVideoPlaying = true;
        this.showVideo = true;
        this.curVideoInfo = {
          Duration: "",
          CurTime: "",
          CurWidth: "",
          CurRealTime: ""
        }

        this.$nextTick(() => {
          let currentTime = "";
          let player = videojs('my-video');
          player.vr({projection: '360'});
          this.activityCheck();
          if (this.netPlayState == 1) {
            let breakTimeSecond = (new Date().getTime() - this.lastTimeStamp) / 1000;
            if (breakTimeSecond + this.curTime >= player.duration()) {
              this.curTime = player.duration();
            } else {
              this.curTime += breakTimeSecond;
            }
            player.currentTime(this.curTime);
          }
          player.on('timeupdate', () => {
            let curTime = player.currentTime();
            this.curVideoInfo.CurRealTime = player.currentTime();
            let minutes = parseInt(curTime / 60);
            let seconds = parseInt(curTime % 60);
            this.curVideoInfo.CurTime = this.getType(minutes) + ':' + this.getType(seconds);
            this.curVideoInfo.CurWidth = player.currentTime() / player.duration();
            //player.vr().camera.quaternion.normalize();
          });
          player.on('loadedmetadata', () => {
            //console.log(this.curTime);
            let duration = player.duration();
            let minutes = parseInt(duration / 60);
            let seconds = parseInt(duration % 60);
            this.curVideoInfo.Duration = this.getType(minutes) + ':' + this.getType(seconds);
          })
          player.on('pause', () => {
            this.wsAdmin.send(JSON.stringify({
              Type: 1, Data: {
                Control: 2,      //2表示暂停
                Resource: this.curNetPlayResource
              }
            }));
          });
          player.on('play', () => {
            this.wsAdmin.send(JSON.stringify({
              Type: 1, Data: {
                Control: 4,      //4表示Resume
                Resource: this.curNetPlayResource
              }
            }));
          });
          player.on("ended", () => {
            clearTimeout(this.inactivityTimeout);
            this.videoPlayedFinished = true;
            this.videoHeaderVisible = true;
            this.isVideoPlaying = false;
          });
          player.on('mousemove', () => {
            this.userActivity = true;
            this.videoHeaderVisible = true;
          });
          this.userActivity = true;
          this.activityCheck();
          player.ready(() => {
            player.play();
          })
        });
      },
      netPlayClose() {
        this.wsAdmin.send(JSON.stringify({
          Type: 1, Data: {
            Control: 3,      //3表示关闭视频
            Resource: this.curNetPlayResource
          }
        }));
        this.netPlayState = 0;
        this.showVideo = false;
        clearInterval(this.activityCheckInterval);
        let player = videojs('my-video');
        player.dispose();
      },
      getType(time) {
        return time < 10 ? "0" + time : time;
      },
      showVideoHeader() {
        this.userActivity = true;
        this.videoHeaderVisible = true;
      },
      videoLocalPlay() {
        if (!this.resourceSelected) {
          const h = this.$createElement;
          this.$message({
            message: h('p', null, [
              h('span', null, '请先选择视频! '),
            ]),
            center: true
          });
          return;
        }
        this.isVideoPlaying = true;
        this.isLocalPlay = true;
        this.showVideo = true;

        this.curVideoInfo = {
          Duration: "",
          CurTime: "",
          CurWidth: ""
        }

        this.$nextTick(() => {
          let player = videojs('my-video');
          player.vr({projection: '360'});
          player.on('timeupdate', () => {
            let curTime = player.currentTime();
            let minutes = parseInt(curTime / 60, 10);
            let seconds = parseInt(curTime % 60);
            this.curVideoInfo.CurTime = this.getType(minutes) + ':' + this.getType(seconds);
            this.curVideoInfo.CurWidth = player.currentTime() / player.duration();
          });
          setInterval(() => {
            let player = videojs('my-video');
            console.log(player.vr().camera.position);
          }, 3000);
          player.on('play', () => {
            this.userActivity = true;
            this.activityCheck();
          });
          player.on('loadedmetadata', () => {
            console.log(this.curTime);
            let duration = player.duration();
            let minutes = parseInt(duration / 60, 10);
            let seconds = parseInt(duration % 60);
            this.curVideoInfo.Duration = this.getType(minutes) + ':' + this.getType(seconds);
          })
          player.on('mousemove', () => {
            this.userActivity = true;
            this.videoHeaderVisible = true;
          })
          player.on("ended", () => {
            clearTimeout(this.inactivityTimeout);
            this.videoPlayedFinished = true;
            this.videoHeaderVisible = true;
            this.isVideoPlaying = false;
            console.log('ended');
          });
          player.ready(() => {
            player.play();
          })
        });
      },
      videoClose() {
        let player = videojs('my-video');
        if (!this.isLocalPlay) {
          this.curTime = player.currentTime();
          this.lastTimeStamp = new Date().getTime();
          console.log(this.curTime);
        }
        player.dispose();
        this.isLocalPlay = false;
        this.showVideo = false;
        clearInterval(this.activityCheckInterval);
      },
      activityCheck() {
        this.activityCheckInterval = setInterval(() => {
          if (this.userActivity) {

            // 重置活动跟踪器
            this.userActivity = false;

            // 清除任何现有的不活动超时以启动计时器
            clearTimeout(this.inactivityTimeout);

            // 在X秒内，如果没有更多的活动发生，用户将被视为不活动
            this.inactivityTimeout = setTimeout(() => {
              // 防止在activityCheck循环拾取下一个用户活动之前可以触发非活动超时的情况。
              if (!this.userActivity) {
                this.videoHeaderVisible = false;
              }
              console.log('inactivityTimeout');
            }, 2000);
          }
        }, 250);
      },
      ...mapMutations({
        updateUserEvents: 'wsData/updateUserEvents',
        setwsAdmin: 'wsData/setwsAdmin',
        updateDeviceList: 'wsData/updateDeviceList'
      }),
    },
    computed: {
      ...mapState({
        resourceSelected: state => state.resource.resourceSelected,
        curUri(state) {
          return state.resource.curUri;
        },
        curResource: state => state.resource.curResource,
        deviceList: state => state.wsData.deviceList
      })
    }
  }
</script>

<style>
  @import "../node_modules/animate.css";
  @import "../node_modules/video.js/dist/video-js.css";

  body, html {
    width: 100%;
    height: 100%;
  }

  body, html, div {
    margin: 0;
    padding: 0;
  }

  @media only screen and (min-width: 768px) {
    html {
      font-size: 9.6px
    }
  }

  @media only screen and (min-width: 992px) {
    html {
      font-size: 12.4px
    }
  }

  @media only screen and (min-width: 1200px) {
    html {
      font-size: 16px
    }
  }

  @media only screen and (min-width: 1920px) {
    html {
      font-size: 20px
    }
  }

  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #my-video {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .video-js .vjs-big-play-button {
    font-size: 2.5em;
    line-height: 2.3em;
    height: 2.5em;
    width: 2.5em;
    -webkit-border-radius: 2.5em;
    -moz-border-radius: 2.5em;
    border-radius: 2.5em;
    background-color: #73859f;
    background-color: rgba(115, 133, 159, .5);
    border-width: 0.15em;
    margin-top: -1.25em;
    margin-left: -1.75em;
  }

  .close-video {
    font-size: 15px;
    color: white;
    cursor: pointer;
    margin-left: 1rem;
  }

  .net-exit {
    font-size: 12px;
    color: white;
    cursor: pointer;
    opacity: 0.7;
    margin-left: 0.5rem;
    border: 1px solid white;
    padding: 5px;
    border-radius: 5px;
  }

  .net-exit:hover {
    color: white;
    border-color: #3a8ee6;
    background-color: #3a8ee6;
  }
</style>
