<template>
  <el-col :span="24" class="mainContdiv">
    <div class="container mainContdiv mainContdiv">
      <div class="omptable mainContdiv mainContdiv">
        <el-row :gutter="40" class="formCont mainContdiv">
          <el-col :span="4" :push="0">
            <h3>标签管理：</h3>
          </el-col>
          <el-col :span="3" :push="17">
            <el-button type="primary" @click="adduser()">添加标签</el-button>
          </el-col>
        </el-row>
        <el-row class="tableCont mainContdiv" :span="16">
          <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="LabelName" label="标签名称" width="180"></el-table-column>
            <el-table-column prop="UserCount" label=" 用户数量" width="110"></el-table-column>
            <el-table-column label="标签条件" style="text-align: center;">
              <el-table-column prop="AppCollectionRatingThreshold" label="应用收藏积分"></el-table-column>
              <el-table-column prop="AppDownloadRatingThreshold" label="应用下载积分"></el-table-column>
              <el-table-column prop="VideoCollectionRatingThreshold" label="视频收藏积分"></el-table-column>
              <el-table-column prop="VideoPlayRatingThreshold" label="视频播放积分"></el-table-column>
              <el-table-column prop="VideoPlaytimeRatingThreshold" label="视频播放时长积分"></el-table-column>
            </el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button size="primary" @click="changepwd(scope)">修改条件</el-button>
                <el-button size="danger" @click="deletetLabel(scope,scope.$index)">删除标签</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="Totalpages"
            layout="prev, pager, next, jumper"
            v-if="lengthpage"
            :total="total"
          ></el-pagination>
        </div>
        <el-dialog title="修改条件" :visible.sync="dialogVisible" width="30%">
          <el-form ref="msgform" :model="msgform" label-width="110px">
            <el-form-item label="标签名称">
              <el-input v-model="msgform.LabelName" style="width:80%"></el-input>
            </el-form-item>
          </el-form>
          <h3>自动标签条件：</h3>
          <el-form ref="msgform" :push="1" :model="msgform" label-width="110px" class="changetag">
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
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeinfo">确 定 修 改</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      tableData: [],
      tablelist: "",
      dialogVisible: false,
      msgform: {
      },
      pagedatalist: "",
      currentPage3: 1, //初始化显示页
      showpage: 1,
      Totalpages: 7, //总页数
      pageshow: 7, //没页显示数量
      total: 0,
      pagelist: 0,
      thispage: 0,
      datalist: "",
      lengthpage: 1,
      seract: 1,
      pagedatashow: "",
      loading: false
    };
  },
  created() {
    this.getlist();
  },
  watch: {},
  methods: {
    page() {
      var list = [];
      var data = this.pagedatashow;
      var newData = [];
      for (var a = this.pagelist; a < this.pageshow; a++) {
        if (data[a] !== undefined) {
          list.push(data[a]);
        }
      }
      this.tableData = list;
    },
    handlelink(value) {
      this.dialoginfo = true;
      var list = [];
      this.axios
        .get("/console/oms/userlabel")
        .then(res => {
          if (res.data.Code !== 0) {
            this.$message.error("错误信息：" + res.data.Message);
            this.lengthpage = 0;
          } else {
            var data = res.data.Data;
            this.tableData = data;
            this.total = data.length;
            this.pagedatalist = data;
            this.pagedatashow = this.pagedatalist;
            this.page();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    deletetLabel(scope, index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          var lid = scope.row.Id;
          var formData = new FormData();
          formData.append("id", lid);
          this.axios
            .delete("/console/oms/userlabel", {
              data: formData,
              headers: { "Content-Type": "application/x-www-form-urlencoded" }
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getlist();
              this.loading = false;
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },
    getlist() {
      this.axios({
        url: "/console/oms/userlabel"
      })
        .then(result => {
          if (result.data.Code !== 0) {
            this.$message.error("错误信息：" + result.data.Message);
          } else {
            var data = result.data.Data;
            this.tableData = data;
            this.tablelist = this.tableData;
            this.total = data.length;
            this.pagedatalist = data;
            this.pagedatashow = this.pagedatalist;
            this.page();
          }
        })
        .catch(err => {});
    },
    adduser() {
      this.$router.push("/opma-dduser");
    },
    uppwd() {
      this.dialogVisible = false;
    },
    changepwd(value) {
      this.dialogVisible = true;
      this.msgform = value.row;
    },
    changeinfo(value) {
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
      formData.append("labelname", this.msgform.LabelName);
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
    },
    resetForm() {
      this.form.nameid = "";
      this.tableData = this.tablelist;
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      var topage = this.currentPage3 - this.thispage;
      this.thispage = this.currentPage3;
      this.pagelist = (val - 1) * this.Totalpages;
      this.pageshow = val * this.Totalpages;
      //console.log(this.tableData);
      this.page();
    }
  }
};
</script>
<style  scope>
.container {
  padding: 3%;
  min-height: 600px;
  height: 100%;
}
.omptable {
  min-height: 750px;
  background: #ffffff;

  height: 100%;
}
.tableCont .el-table {
  min-height: 550px;
}
.formCont {
  padding: 1% 4%;
}
.tableCont {
  padding: 0 5%;
}
.changetag .el-input {
  width: 65%;
  margin-right: 7%;
}
#app .block {
  text-align: center;
  margin-top: 30px;
}
</style>
