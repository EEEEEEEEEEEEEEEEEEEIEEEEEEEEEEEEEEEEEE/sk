<template>
  <el-col :span="24" class="mainContdiv main">
    <div class="container mainContdiv mainContdiv">
      <div class="omptable mainContdiv mainContdiv">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row :gutter="40" class="formCont mainContdiv">
            <el-col :span="5">
              <el-form-item label="用户ID">
                <el-input v-model="form.UserId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="电话号码">
                <el-input v-model="form.Userphone"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="用户标签">
                <el-select v-model="form.tabtype" placeholder="请选择应用名称">
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
              <el-table-column prop="Id" label="用户ID"></el-table-column>
              <el-table-column prop="Phone" label="用户手机号 "></el-table-column>
              <el-table-column prop="Nickname" label="用户昵称"></el-table-column>
              <el-table-column prop="UserLabel" label="活跃度标签"></el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button size="primary" @click="handlelink(scope)">查看详情</el-button>
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
        UserId: "",
        Userphone: "",
        tabtype: ""
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
      lengthpage: 0,
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
      var name = this.form.UserId,
        ompid = this.form.Userphone,
        ompname = this.form.tabtype;
      for (var a = 0; a < this.tablelist.length; a++) {
        if (this.tablelist[a].Id.toString().indexOf(name) !== -1) {
          if (this.tablelist[a].Phone.toString().indexOf(ompid) !== -1) {
            if (this.tablelist[a].UserLabel.indexOf(ompname) !== -1) {
              this.newData.push(this.tablelist[a]);
            }
          }
        }
      }
      this.total = this.newData.length;
      this.currentPage3 = 1;
      this.pagelist = 0;
      this.pageshow = 7;
      this.page(this.newData);
    },
    page(data) {
      var list = [];
      var data = data;
      var newData = [];
      for (var a = this.pagelist; a < this.pageshow; a++) {
        if (data[a] !== undefined) {
          list.push(data[a]);
        }
      }
      this.tableData = list;
    },
    handlelink(value) {
      var UserId = value.row.Id;
      this.$router.push({
        name: "omsserinfo",
        query: {
          UserId: UserId
        }
      });
    },
    solt(arr) {
      var result = [];
      var hash = [];
      for (var a = 0; a < arr.length; a++) {
        result.push(arr[a].UserLabel);
      }
      for (var i = 0; i < result.length; i++) {
        if (hash.indexOf(result[i]) == -1) {
          hash.push(result[i]);
        }
      }
      this.seractselect = hash;
    },
    getlist() {
      this.axios({
        url: "/console/oms/user"
      })
        .then(result => {
          if (result.data.Code !== 0) {
            this.$message.error("错误信息：" + result.data.Message);
            this.lengthpage = 0;
          } else {
            this.tableData = result.data.Data;
            var solt = this.solt(result.data.Data);
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
      this.page(this.newData);
    }
  }
};
</script>
<style>
</style>
