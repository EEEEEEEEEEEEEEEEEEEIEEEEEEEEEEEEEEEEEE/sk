<template>
  <div>
    <div class="container">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">用户列表</el-breadcrumb-item>
          <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main clearfix">
        <el-col>
          <h3 class="titles">基本信息：</h3>
          <el-col :span="4">
            <div class="headecont">
              <img src="../../../static/image/headimg.png" class="headimg" alt>

              <p class="tabtype">
                <img src="../../../static/image/heat4.png" alt>
                {{infolist.UserLabel}}
              </p>
            </div>
          </el-col>
          <el-col :span="16" :push="1" class="information">
            <el-row class="listli">
              <el-col :span="4">
                <div class="grid-content bg-purple">用户ID：</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content bg-purple-light">{{infolist.Id}}</div>
              </el-col>
              <el-col :span="4" :push="2">
                <div class="grid-content bg-purple">电话号码：</div>
              </el-col>
              <el-col :span="7" :push="2">
                <div class="grid-content bg-purple-light">{{infolist.Phone}}</div>
              </el-col>
            </el-row>

            <el-row class="listli">
              <el-col :span="4">
                <div class="grid-content bg-purple">昵称：</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content bg-purple-light">{{infolist.Nickname}}</div>
              </el-col>
              <el-col :span="4" :push="2">
                <div class="grid-content bg-purple">注册时间：</div>
              </el-col>
              <el-col :span="7" :push="2">
                <div class="grid-content bg-purple-light">{{infolist.RegisterTime}}</div>
              </el-col>
            </el-row>

            <el-row class="listli">
              <el-col :span="4">
                <div class="grid-content bg-purple">用户来源：</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content bg-purple-light">{{infolist.RegisterMethod}}</div>
              </el-col>
              <el-col :span="4" :push="2">
                <div class="grid-content bg-purple">用户邮箱：</div>
              </el-col>
              <el-col :span="7" :push="2">
                <div class="grid-content bg-purple-light">{{infolist.Email}}</div>
              </el-col>
            </el-row>
          </el-col>
        </el-col>
        <el-col style="margin:20px 0">
          <h3 class="titles">统计信息：</h3>

          <el-col :span="21">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="AppCollectionCount" label="应用收藏数"></el-table-column>
              <el-table-column prop="AppDownloadCount" label="应用下载数"></el-table-column>
              <el-table-column prop="VideoPlayCount" label="视频观看数"></el-table-column>
              <el-table-column prop="VideoCollectionCount" label="视频收藏数"></el-table-column>
              <el-table-column prop="VideoPlaytimeTotal" label="视频观看时长"></el-table-column>
            </el-table>
          </el-col>
        </el-col>
        <el-col>
          <h3 class="titles">统计信息：</h3>

          <el-col :span="21">
            <el-table :data="orderlist" max-height="300">
              <el-table-column prop="ordernumber" label="订单编号"></el-table-column>
              <el-table-column prop="orderTime" label="提交时间"></el-table-column>
              <el-table-column prop="orderSource" label="订单来源"></el-table-column>
              <el-table-column prop="orderamount" label="订单金额"></el-table-column>
              <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button size="primary" plain disabled @click="handlelink(scope)">查看订单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 详情内容字段根据YApi接口返回数据接口
      infolist: {
        userid: "",
        Username: "",
        Nickname: "",
        Phone: "",
        Email: "",
        Password: "",
        RegisterTime: "",
        LastLoginTime: "",
        Enabled: "",
        Logonmethod: "",
        UserLabelId: "",
        AppCollectionRating: "",
        AppDownloadRating: "",
        VideoCollectionRating: "",
        VideoPlayRating: "",
        VideoPlaytimeRating: ""
      },
      userid: "1",
      tableData: [],
      orderlist: []
    };
  },
  created() {
    this.onSubmit();
  },
  methods: {
    onSubmit() {
      var ids = this.$route.query.UserId;
      this.axios({
        url: "/console/oms/user",
        params: {
          id: ids
        }
      })
        .then(result => {
          if (result.data.Code !== 0) {
            this.$message.error("错误信息：" + result.data.Message);
            this.lengthpage = 0;
          } else {
            var data = result.data.Data;
            this.infolist = data;
            switch (this.infolist.RegisterMethod) {
              case 1:
                this.infolist.RegisterMethod = "快捷登录";
                break;
              case 2:
                this.infolist.RegisterMethod = "快捷登录";
                break;
              default:
                this.infolist.RegisterMethod = "数据丢失";
            }
           this.infolist.RegisterTime=this.format(this.infolist.RegisterTime*1000)
            this.tableData.push(data);
          }
        })
        .catch(err => {});
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
  }
};
</script>
<style>
#app  .container {
  padding: 3%;
  min-height: 400px;
  height: 100%;
}
#app .main {
  height: 100%;
  margin: 30px 0;
  padding: 2% 6% 0 6%;
  min-height: 750px;
  background: #ffffff;
}

#app .clearfix::after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
#app .clearfix {
  zoom: 1;
}
#app information {
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  min-height: 205px;
}
#app .listli {
  line-height: 50px;
  border-bottom: 1px solid #dddddd;
  font-size: 15px;
}
#app .titles {
  margin: 25px 0;
}
#app .tabtype {
  line-height: 38px;
  font-weight: 700;
  color: #ef5050;
}
#app .tabtype img {
  width: 19px;
  margin: 0 5px;
  vertical-align: sub;
}
#app .headecont {
  width: 100%;
  border: 1px solid #dddddd;
  padding-top: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  min-height: 190px;
  text-align: center;
}
#app .headecont .headimg {
  width: 100px;
  border-radius: 50%;
}
</style>
