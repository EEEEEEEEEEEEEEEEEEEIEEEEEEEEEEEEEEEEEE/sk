<template>
  <el-col :span="24" class="mainContdiv main">
    <div class="container mainContdiv mainContdiv">
      <div class="omptable mainContdiv mainContdiv">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row :gutter="40" class="formCont mainContdiv">
            <el-col :span="4">
              <el-form-item label="用户ID">
                <el-input v-model="form.nameid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="应用ID">
                <el-input v-model="form.ompid"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="应用名称">
                <el-select v-model="form.ompname" placeholder="请选择应用名称">
                  <el-option
                    v-for="(item , index) in seractselect"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-button type="primary" @click="onserach">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="tableCont mainContdiv">
          <el-scrollbar style="height:100%">
            <el-table :data="tableData" stripe style="width: 110%" max-height="550">
              >
              <el-table-column prop="UserId" label="用户名称" width="180"></el-table-column>
              <el-table-column prop="ApkId" label="应用ID " width="100"></el-table-column>
              <el-table-column prop="ApkName" label="应用名称" min-width="200"></el-table-column>
              <el-table-column prop="ApkVersion" label="APK版本"></el-table-column>
              <el-table-column prop="Platform" label="APK平台"></el-table-column>
              <el-table-column prop="statusString" label="签名状态"></el-table-column>
              <el-table-column prop="Timestamp" label="上次变更时间" width="180"></el-table-column>
              <el-table-column label="Apk下载" width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button size="primary" @click="handlelink(scope)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
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
        </el-row>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      form: {
        nameid: "",
        ompid: "",
        ompname: ""
      },
      tableData: [],
      tablelist: "",
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
      seractselect: [],
      newData: [],
      statusString: []
    };
  },
  created() {
    this.getlist();
  },
  watch: {},
  methods: {
    onserach() {
      this.newData = [];
      this.seract = 0;
      var name = this.form.nameid,
        ompid = this.form.ompid,
        ompname = this.form.ompname;
      for (var a = 0; a < this.tablelist.length; a++) {
        if (this.tablelist[a].UserId.toString().indexOf(name) !== -1) {
          if (this.tablelist[a].ApkId.toString().indexOf(ompid) !== -1) {
            if (this.tablelist[a].ApkName.indexOf(ompname) !== -1) {
              this.newData.push(this.tablelist[a]);
            }
          }
        }
      }
      this.total = this.newData.length;
      this.currentPage3 = 1;
      this.pagelist = 0;
      this.pageshow = 7;
      //console.log(this.newData);
      this.page(this.newData);
    },
    page(data) {
      var list = [];
      var data = data;
      var newData = [];
      //console.log(data);
      //console.log(list);
      for (var a = this.pagelist; a < this.pageshow; a++) {
        if (data[a] !== undefined) {
          list.push(data[a]);
        }
      }
      this.tableData = list;
    },
    handlelink(value) {
      console.log(value.row.SignStatus);
      if (value.row.SignStatus !== 0) {
        var urls = "http://server_opm.skyworthxr.com" + value.row.OriginFile;
      } else {
        var urls = "http://server_opm.skyworthxr.com" + value.row.File;
      }
      window.location.href = urls;
    },
    solt(arr) {
      //console.log(arr);
      var result = [];
      var hash = [];
      for (var a = 0; a < arr.length; a++) {
        result.push(arr[a].ApkName);
      }
      for (var i = 0; i < result.length; i++) {
        if (hash.indexOf(result[i]) == -1) {
          hash.push(result[i]);
        }
      }
      //console.log(hash);
      this.seractselect = hash;
    },
    getlist() {
      this.axios({
        url: "/api/opm/apksignrecord/list"
      })
        .then(result => {
          if (result.data.Code !== 0) {
            this.$message.error("错误信息：" + result.data.Message);
            this.lengthpage = 0;
          } else {
            this.tableData = result.data.Data;
            var solt = this.solt(result.data.Data);
            for (var a = 0; a < this.tableData.length; a++) {
              this.tableData[a].Timestamp = this.format(
                this.tableData[a].Timestamp * 1000
              );

              if (this.tableData[a].SignStatus !== 0) {
                this.tableData[a].statusString = "签名失败";
              } else {
                this.tableData[a].statusString = "签名成功";
              }
              if (this.tableData[a].Platform == 1) {
                this.tableData[a].Platform = "S8000";
              } else if (this.tableData[a].Platform == 2) {
                this.tableData[a].Platform = "V901";
              } else {
                this.tableData[a].Platform = "S801";
              }
            }
            this.newData = this.tableData;
            this.tablelist = this.tableData;
            this.total = this.tablelist.length;
            this.lengthpage = 1;
            this.page(this.tablelist);
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
    resetForm() {
      this.form.nameid = "";
      this.form.ompid = "";
      this.form.ompname = "";
      // this.tableData = this.tablelist;
      this.total = this.tablelist.length;
      this.currentPage3 = 1;
      this.seract = 1;
      this.page(this.tablelist);
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
      this.page(this.newData);
    }
  }
};
</script>
<style>
#app .main .container {
  padding: 3%;
  min-height: 400px;
  height: 100%;
}
#app .main .omptable {
  min-height: 300px;
  background: #ffffff;
  height: 100%;
}
#app .main .formCont {
  padding: 1% 4%;
}
#app .main .container .el-table--fit {
  height: auto;
  min-height: 500px;
}
#app .main .block {
  text-align: center;
  margin-top: 50px;
}

#app .main .tableCont {
  padding: 0 5%;
}
</style>
