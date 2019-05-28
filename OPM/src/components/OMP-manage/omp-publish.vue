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
                <el-select v-model="form.ompname" placeholder="请选择应用名称">
                  <el-option label="上海市" value="上海市"></el-option>
                  <el-option label="上海市" value="上海市"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-button type="primary" @click="onserach">查询</el-button>
              <el-button>重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="tableCont mainContdiv">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="nameid" label="用户ID" width="180"></el-table-column>
            <el-table-column prop="ompid" label="应用ID " width="180"></el-table-column>
            <el-table-column prop="ompname" label="应用名称"></el-table-column>
            <el-table-column prop="ompntype" label="签名状态"></el-table-column>
            <el-table-column prop="omptime" label="上次变更时间"></el-table-column>
            <el-table-column prop="link" label="Apk下载"></el-table-column>
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
      tablelist:""
    };
  },
  created() {
    this.tablelist=this.tableData;
  },
  watch: {},
  methods: {
    onserach() {
      var newData = [];
      var name = this.form.nameid,
        ompid = this.form.ompid,
        ompname = this.form.ompname;
      for (var a = 0; a < this.tablelist.length; a++) {
        console.log(this.tablelist[a].nameid.indexOf(name))
        console.log(this.tablelist[a].ompid.indexOf(ompid))
        console.log(this.tablelist[a].ompname.indexOf(ompname))
        if (this.tablelist[a].nameid.indexOf(name) !== -1) {
          if (this.tablelist[a].ompid.indexOf(ompid) !== -1) {
            if (this.tablelist[a].ompname.indexOf(ompname)!== -1) {
                newData.push(this.tablelist[a])
            }
          }
        }
      }
       this.tableData=newData
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
