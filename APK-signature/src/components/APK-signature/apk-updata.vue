<template>
  <el-col :span="24" class="mainContdiv">
    <el-steps :active="active" simple>
      <el-step title="上传APK" icon="el-icon-upload" @click="toupApk"></el-step>
      <el-step title="等待签名" icon="el-icon-edit"></el-step>
      <el-step title="下载APK" icon="el-icon-picture"></el-step>
    </el-steps>
    <el-col
      :span="24"
      class="apkup"
      v-loading="loading2"
      element-loading-text="正在签名中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#ddd"
    >
      <el-col class="upcont" v-show="upapktype">
        <el-form ref="form" :model="form" class="platfroms" label-width="80px">
          <el-form-item label="应用平台" style="    width: 64%;">
            <el-select v-model="form.platform" placeholder="请选择平台">
              <el-option label="S8000  " value="1"></el-option>
              <el-option label="V901  " value="2"></el-option>
              <el-option label="S801  " value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-upload
          class="upload-demo"
          drag
          action="/api/opm/apk/upload"
          multiple
          :headers="headers"
          :on-error="uperror"
          :on-success="upsuccess"
          :data="data"
          :on-change="upchange"
          :before-upload="beforeupload"
          :on-progress="onprogress	"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将Apk文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-col>
      <el-col class="upcont" v-show="downloadapk">
        <img src="../../../static/image/apk.png">
        <el-col class="loglist">
          <p>APk名称:{{apkname}} ，签名时间：{{plattime}}， 状态：签名成功</p>
        </el-col>
        <el-col>
          <el-button @click="toupApk">继续上传</el-button>
          <el-button type="primary" @click="dunApk">下载Apk</el-button>
        </el-col>
      </el-col>
    </el-col>
  </el-col>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      active: 0,
      upapktype: 1,
      upapklogin: 0,
      downloadapk: 0,
      loading2: false,
      headers: {
        headers: "multipart/form-data"
      },
      platform: "",
      form: {
        platform: "1"
      },
      data: {
        platform: 1
      },
      plattime: 0,
      apkname: 0,
      ApkFile: 0
    };
  },
  created() {
    this.tablelist = this.tableData;
  },
  watch: {},
  methods: {
    upsuccess(response, file, fileList) {
      this.active = 2;
      this.loading2 = false;
      this.upapktype = 0;
      this.downloadapk = 1;
      var Timestamp = new Date(response.Data.Timestamp * 1000).toLocaleString();
      this.plattime = Timestamp;
      this.apkname = response.Data.ApkName;
      this.ApkFile = response.Data.File;
       // //console.log(this.ApkFile);
    },
    onprogress(event, file, fileList) {
       //console.log(event);
      if (event.percent == 100) {
        this.active = 1;
        this.loading2 = true;
      }
    },
    upchange(e, file, fileList) {
       //console.log(e);
      if (e.percentage == 100) {
      }
    },
    upapkloginfun() {
      this.active = 1;
      this.loading2 = false;
      this.downloadapk = 1;
    },
    toupApk() {
      this.active = 0;
      this.upapktype = 1;
      this.downloadapk = 0;
    },
    uperror(err, file, fileList) {
      this.active = 0;
      this.upapktype = 1;
      this.downloadapk = 0;
       //console.log(err);
       //console.log(file);
       //console.log(fileList);
      this.$message.error("上传失败，请重试");
    },
    dunApk() {
       //console.log(this.ApkFile);
      window.location.href = "http://server_opm.skyworthxr.com" + this.ApkFile;
    },
    beforeupload() {
       // //console.log(this.form);
    }
  }
};
</script>
<style >
.mainContdiv {
  padding: 3%;
  min-height: 400px;
  height: 100%;
}
.Breadcrumb {
  padding: 2%;
}
.el-step__head.is-process {
  color: #009688;
}
.platfroms {
  width: 39%;
  margin: 10px auto;
}
.el-step__title.is-process {
  color: #009688;
}
.apkup {
  min-height: 600px;
  background: #fff;
}
.upcont {
  width: 100%;
  margin: 10% auto;
  text-align: center;
}
.upcont .upload-demo {
  width: 39%;
  margin: auto;
}
.el-loading-mask {
  background: #fff !important ;
}
.upcont .upload-demo .el-upload-list__item-name {
  text-align: left;
}
.el-steps--simple {
  padding: 30px 8%;
}
.loglist {
  color: #606266;
  line-height: 12px;
  margin: 15px 0;
}
</style>
