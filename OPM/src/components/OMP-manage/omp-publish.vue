<template>
  <el-col :span="24" class="mainContdiv">
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
                <el-select v-model="form.ompname" placeholder="请选择应用名称" >
                
                  <el-option  v-for="(item , index) in seractselect" :key="index" :label="item" :value="item" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-button type="primary" @click="onserach">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="tableCont mainContdiv">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="UserId" label="用户ID" width="180"></el-table-column>
            <el-table-column prop="ApkId" label="应用ID " width="180"></el-table-column>
            <el-table-column prop="ApkName" label="应用名称"></el-table-column>
            <el-table-column prop="ApkVersion" label="APK版本"></el-table-column>
            <el-table-column prop="Platform" label="APK平台"></el-table-column>
            <el-table-column prop="SignStatus" label="签名状态"></el-table-column>
            <el-table-column prop="Timestamp" label="上次变更时间"></el-table-column>
            <el-table-column label="Apk下载" width="180">
              <template slot-scope="scope">
                <el-button size="primary" @click="handlelink(scope)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
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
        nameid: "1",
        ompid: "18",
        ompname: ""
      },
      tableData: [],
      tablelist: "",
      currentPage3: 1, //初始化显示页
      showpage: 1,
      Totalpages: 8, //总页数
      pageshow: 8, //没页显示数量
      total: 100,
      pagelist: 0,
      thispage: 0,
      datalist: "",
      lengthpage: 1,
      seract: 1,
      seractselect:[]
    };
  },
  created() {
    this.getlist();
  },
  watch: {},
  methods: {
    onserach() {
      this.seract = 0;
      var newData = [];
      var name = this.form.nameid,
        ompid = this.form.ompid,
        ompname = this.form.ompname;
      for (var a = 0; a < this.tablelist.length; a++) {
        if (this.tablelist[a].UserId.toString().indexOf(name) !== -1) {
          if (this.tablelist[a].ApkId.toString().indexOf(ompid) !== -1) {
            console.log(this.tablelist[a].ApkName.indexOf(ompname))
            if (this.tablelist[a].ApkName.indexOf(ompname) !== -1) {
              newData.push(this.tablelist[a]);
            }
          }
        }
      }
      this.total = newData.length;
      this.tableData = newData;
      this.currentPage3 = 1;
    },
    page() {
      var list = [];
      var data = this.tablelist;
      var newData = [];

      for (var a = this.pagelist; a < this.pageshow; a++) {
        if (data[a] !== undefined) {
          if (this.seract == 0) {
            var name = this.form.nameid,
              ompid = this.form.ompid,
              ompname = this.form.ompname;
            if (data[a].UserId.toString().indexOf(name) !== -1) {
              if (data[a].ApkId.toString().indexOf(ompid) !== -1) {
                if (data[a].ApkName.indexOf(ompname) !== -1) {
                  list.push(data[a]);
                }
              }
            }
          } else {
            list.push(data[a]);
          }
        }
      }
      this.tableData = list;
    },
    handlelink(value) {
      if (value.row.SignStatus !== 0) {
        var urls = "http://192.168.1.200:8087" + value.row.OriginFile;
      } else {
        var urls = "http://192.168.1.200:8087" + value.row.File;
      }
      window.location.href = urls;
    },
    solt(arr) {
      console.log(arr);
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
      console.log(hash)
      this.seractselect=hash
    },
    getlist() {
      this.axios({
        url: "/api/opm/apksignrecord/list"
      })
        .then(result => {
          this.tableData = result.data.Data;
          var solt = this.solt(result.data.Data);
          for (var a = 0; a < this.tableData.length; a++) {
            this.tableData[a].Timestamp = new Date(
              this.tableData[a].Timestamp * 1000
            ).toLocaleString();
            if (this.tableData[a].SignStatus !== 0) {
              this.tableData[a].SignStatus = "签名失败";
            } else {
              this.tableData[a].SignStatus = "签名成功";
            }
          }
          this.tablelist = this.tableData;
          this.total = this.tablelist.length;
          this.lengthpage = 1;
          this.page();
        })
        .catch(err => {});
    },
    resetForm() {
      this.form.nameid = "1";
      this.form.ompid = "18";
      this.form.ompname = "";
      this.tableData = this.tablelist;
      this.total = this.tablelist.length;
      this.currentPage3 = 1;
      this.seract = 1;
      console.log(this.tableData);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      var topage = this.currentPage3 - this.thispage;
      this.thispage = this.currentPage3;
      this.pagelist = (val - 1) * this.Totalpages;
      this.pageshow = val * this.Totalpages;
      console.log(this.tableData);
      this.page();
    }
  }
};
</script>
<style>
.container {
  padding: 3%;
  min-height: 400px;
  height: 100%;
}
.omptable {
  min-height: 300px;
  background: #ffffff;
  height: 100%;
}
.formCont {
  padding: 1% 4%;
}
.container .el-table--fit {
  height: 60%;
}
.block {
  text-align: center;
  margin-top: 50px;
}

.tableCont {
  padding: 0 5%;
}
</style>
