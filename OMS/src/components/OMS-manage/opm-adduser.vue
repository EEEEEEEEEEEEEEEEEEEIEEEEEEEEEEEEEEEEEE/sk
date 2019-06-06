<template>
  <div class="container">
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/oms-userlist' }">标签管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加标签</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="formCont omptable" style="margin-top:20px;">
      <el-form ref="msgform" :model="msgform" label-width="110px">
        <el-form-item label="标签名称">
          <el-input v-model="msgform.LabelName" style="width:33%"></el-input>
        </el-form-item>
      </el-form>
      <div style="width:36.5%">
        <h3>
          自动标签条件：
         
        </h3>
      </div>
      <el-form ref="msgform" :push="1" :model="msgform" label-width="110px" class="changetaglist">
        <el-form-item label="应用收藏">
          <el-input v-model="msgform.AppCollectionRatingThreshold">
            <template slot="append">分</template>
          </el-input>
          <el-switch
            v-model="msgform.AppCollectionRatingEssential"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="应用下载：">
          <el-input v-model="msgform.AppDownloadRatingThreshold">
            <template slot="append">分</template>
          </el-input>
          <el-switch
            v-model="msgform.AppDownloadRatingEssential"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="视频收藏：">
          <el-input v-model="msgform.VideoCollectionRatingThreshold">
            <template slot="append">分</template>
          </el-input>
          <el-switch
            v-model="msgform.VideoCollectionRatingEssential"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="视频观看时长：">
          <el-input v-model="msgform.VideoPlaytimeRatingThreshold">
            <template slot="append">分</template>
          </el-input>
          <el-switch
            v-model="msgform.VideoPlaytimeRatingEssential"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="视频观看数：">
          <el-input v-model="msgform.VideoPlayRatingThreshold">
            <template slot="append">分</template>
          </el-input>
          <el-switch
            v-model="msgform.VideoPlayRatingEssential"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="综合积分：">
          <el-input v-model="msgform.OverallRatingThreshold">
            <template slot="append">分</template>
          </el-input>
          <el-switch
            v-model="msgform.OverallRatingEssential"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="优先权：">
          <el-input v-model="msgform.Priority">
            <template slot="append">分</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msgform: {
        AppCollectionRatingEssential:true,
        AppDownloadRatingEssential:true,
        VideoCollectionRatingEssential:true,
        VideoPlaytimeRatingEssential:true,
        VideoPlayRatingEssential:true,
        VideoPlayRatingEssential:true,
        OverallRatingEssential:true
      },
      allopen:false,
      text: "开启状态"
    };
  },
  methods: {
    textchange() {
      console.log(this.text);
      if (this.form.checket == true) {
        this.text = "开启状态";
      } else {
        this.text = "禁用状态";
      }
    },
    allopenswitch(){
      if(this.allopen){

      }
    },
    onSubmit() {
      var formData = new FormData();
      formData.append("id", this.msgform.Id),
        formData.append(
          "appCollectionRatingEssential",
          this.msgform.AppCollectionRatingEssential
        );
      formData.append(
        "appCollectionRating",
        this.msgform.AppCollectionRatingThreshold
      );
      formData.append(
        "appDownloadRating",
        this.msgform.AppDownloadRatingThreshold
      );
      formData.append(
        "appDownloadRatingEssential",
        this.msgform.AppDownloadRatingEssential
      );
      formData.append("labelname", this.msgform.LabelName),
        formData.append(
          "overallRatingEssential",
          this.msgform.OverallRatingEssential
        );
      formData.append("overallRating", this.msgform.OverallRatingThreshold);
      formData.append("priority", this.msgform.Priority);
      formData.append(
        "videoCollectionRatingEssential",
        this.msgform.VideoCollectionRatingEssential
      );
      formData.append(
        "videoCollectionRating",
        this.msgform.VideoCollectionRatingThreshold
      );
      formData.append(
        "videoPlayRatingEssential",
        this.msgform.VideoPlayRatingEssential
      );
      formData.append("videoPlayRating", this.msgform.VideoPlayRatingThreshold);
      formData.append(
        "videoPlaytimeRatingEssential",
        this.msgform.VideoPlaytimeRatingEssential
      );
      formData.append(
        "videoPlaytimeRating",
        this.msgform.VideoPlaytimeRatingThreshold
      );
      console.log(this.msgform);
      this.axios
        .post("/console/oms/userlabel", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        .then(res => {
          if (res.data.Code !== 0) {
            this.$message.error("错误信息：" + res.data.Message);
          } else {
            this.dialogVisible = false;
            this.$message({
              message: res.data.Message,
              type: "success"
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style scope>
#app .container {
  padding: 3%;
  min-height: 400px;
  height: 100%;
}
#app .omptable {
  min-height: 300px;
  background: #ffffff;

  height: 100%;
}
#app .formCont {
  padding: 3% 4%;
}
#app .tableCont {
  padding: 0 5%;
}
#app .changetaglist .el-input {
  width: 25%;
  margin-right: 3%;
}
</style>
