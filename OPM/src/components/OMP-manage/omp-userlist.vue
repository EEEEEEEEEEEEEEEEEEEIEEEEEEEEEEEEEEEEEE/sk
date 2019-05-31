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
              <el-button type="primary" @click="onserach">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-col>
            <el-col :span="4" :push="2">
              <el-button type="primary" @click="adduser()" style="float:lfet">添加用户</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="tableCont mainContdiv" :span="24">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="UserName" label="用户ID" width="180"></el-table-column>
            <el-table-column prop="RegisterTimestamp" label="注册时间" width="280"></el-table-column>
            <el-table-column label="操作日志" width="180">
              <template slot-scope="scope">
                <el-button size="primary" @click="handlelink(scope)">详情</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="primary" @click="changepwd(scope)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
          <el-form ref="msgform" :model="msgform" label-width="110px">
            <el-form-item label="请输入新秘密">
              <el-input v-model="msgform.newpwd"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="postpwd">确 定 修 改</el-button>
          </span>
        </el-dialog>
        <el-dialog title="操作详情内容" :visible.sync="dialoginfo" width="70%">
          <el-row class="tableCont" :span="13">
            <el-table :data="infodata" stripe style="width: 100%">
              <el-table-column prop="Timestamp" label="操作时间"></el-table-column>
              <el-table-column prop="ApkName" label="应用名称"></el-table-column>
              <el-table-column prop="info" label="操作描述"></el-table-column>
              <el-table-column prop="SignStatus" label="签名状态"></el-table-column>
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialoginfo = false">取 消</el-button>
            <el-button type="primary" @click="dialoginfo = false">确定修改</el-button>
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
      form: {
        nameid: ""
      },
      tableData: [],
      tablelist: "",
      dialogVisible: false,
      dialoginfo: false,
      msgform: {
        newpwd: ""
      },
      infodata: [],
      changeinfo: {
        pwd: 0,
        name: 0,
        id: 0
      },
      pagedatalist: "",
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
      pagedatashow: ""
    };
  },
  created() {
    this.getlist();
  },
  watch: {},
  methods: {
    onserach() {
      var newData = [];
      var name = this.form.nameid;
      for (var a = 0; a < this.pagedatalist.length; a++) {
        console.log(this.pagedatalist[a].UserName, name);
        if (this.pagedatalist[a].UserName.indexOf(name) !== -1) {
          newData.push(this.pagedatalist[a]);
        }
      }
      this.tableData = newData;
    },
    page() {
      var list = [];
      var data = this.pagedatashow;
      var newData = [];
      for (var a = this.pagelist; a < this.pageshow; a++) {
        if (data[a] !== undefined) {
          list.push(data[a]);
        }
      }
      this.infodata = list;
    },
    handlelink(value) {
      this.dialoginfo = true;
      var list = [];
      this.axios
        .get("/api/opm/apksignrecord/list")
        .then(res => {
          var data = res.data.Data;
          
              console.log(value.row.Id)
          for (var a = 0; a < data.length; a++) {
            if (data[a].UserId == value.row.Id) {
              data[a].Timestamp = new Date(
                data[a].Timestamp * 1000
              ).toLocaleString();
              data[a].info = "请求签名";
              list.push(data[a]);
            }
          }
          this.infodata = list;
          this.total = list.length;
          this.pagedatalist = list;
          this.pagedatashow = this.pagedatalist;
          this.page();
        })
        .catch(err => {
          console.error(err);
        });
    },
    getlist() {
      this.axios({
        url: "/api/opm/user/list"
      })
        .then(result => {
          this.tableData = result.data.Data;
          for (var a = 0; a < this.tableData.length; a++) {
            this.tableData[a].RegisterTimestamp = new Date(
              this.tableData[a].RegisterTimestamp * 1000
            ).toLocaleString();
          }
          this.tablelist = this.tableData;
        })
        .catch(err => {});
    },
    adduser() {
      this.$router.push("/opma-dduser");
    },
    handchangepwd() {
      this.$prompt("请输入你修改的密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          console.log(value);
        })
        .catch(() => {});
    },
    uppwd() {
      this.dialogVisible = false;
      console.log(this.msgform);
    },
    changepwd(value) {
      this.dialogVisible = true;
      this.changeinfo.id = value.row.Id;
      this.changeinfo.name = value.row.UserName;
    },
    postpwd() {
      var tid = this.changeinfo.id;
      var name = this.changeinfo.name;
      var forms = new FormData();
      forms.append("userid", tid);
      forms.append("password", this.msgform.newpwd);
      forms.append("username", this.changeinfo.name);
      this.axios
        .post("/api/opm/user/createorupdate", forms, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        .then(res => {
          this.dialogVisible = false;
          this.$message({
            message: res.data.Message,
            type: "success"
          });
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
.tableCont .el-table {
  min-height: 350px;
}
.formCont {
  padding: 1% 4%;
}
.tableCont {
  padding: 0 5%;
}
</style>
