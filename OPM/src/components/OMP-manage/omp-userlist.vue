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
              <el-button>重置</el-button>
            </el-col>
            <el-col :span="4" :push="2">
              <el-button type="primary" @click="adduser()" style="float:lfet">添加用户</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="tableCont mainContdiv" :span="11" style="width:60%;">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="nameid" label="用户ID" width="180"></el-table-column>
            <el-table-column prop="omptime" label="注册时间"></el-table-column>
            <el-table-column label="操作日志" width="180">
              <template slot-scope="scope">
                <el-button size="primary" @click="handlelink(scope)">详情</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="primary" @click="handlelinks(scope)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
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
        nameid: "100111",
        ompid: "王小虎",
        ompname: ""
      },
      tableData: [
        {
          nameid: "100111",
          ompid: "王小虎",
          ompname: "上海市普陀区金沙江路 1518 弄",
          ompntype: "2016-05-02",
          omptime: "王小虎",
          link: "上海市普陀区金沙江路 1518 弄"
        },
        {
          nameid: "100112",
          ompid: "王小虎",
          ompname: "上海市普陀区金沙江路 1518 弄",
          ompntype: "2016-05-02",
          omptime: "王小虎",
          link: "上海市普陀区金沙江路 1518 弄"
        },
        {
          nameid: "100113",
          ompid: "王小虎",
          ompname: "上海市普陀区金沙江路 1518 弄",
          ompntype: "2016-05-02",
          omptime: "王小虎",
          link: "上海市普陀区金沙江路 1518 弄"
        },
        {
          nameid: "100114",
          ompid: "王大虎",
          ompname: "上海市普陀区金沙江路 1518 弄",
          ompntype: "2016-05-02",
          omptime: "王小虎",
          link: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      tablelist: ""
    };
  },
  created() {
    this.tablelist = this.tableData;
  },
  watch: {},
  methods: {
    onserach() {
      var newData = [];
      var name = this.form.nameid;
      for (var a = 0; a < this.tablelist.length; a++) {
        console.log(this.tablelist[a].nameid.indexOf(name));
        if (this.tablelist[a].nameid.indexOf(name) !== -1) {
          newData.push(this.tablelist[a]);
        }
      }
      this.tableData = newData;
    },
    handlelink(value) {
      var nameid = value.row.nameid;
      var opmid= value.row.ompid
      var info={
        nameid:nameid,
        opmid:opmid
      }
      this.$router.push({path: '/opma-userinfo', query: {info: info}})
    },
    adduser() {
      this.$router.push("/opma-dduser");
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
.tableCont {
  padding: 0 5%;
}
</style>
