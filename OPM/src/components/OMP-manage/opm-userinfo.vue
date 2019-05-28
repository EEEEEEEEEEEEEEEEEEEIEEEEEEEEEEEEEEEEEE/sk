<template>
  <div class="container">
    <el-row class="tableCont " :span="11" >
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="omptime" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="ompname" label="应用名称"></el-table-column>
        <el-table-column prop="ompinfo" label="操作描述"></el-table-column>
        <el-table-column prop="omptype" label="签名状态"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        pwd: "",
        checked: true
      },
      tableData: [
        {
          omptime: "2019年11月11日",
          ompname: "王者荣耀1518",
          omptype: "签名",
          ompinfo: "上海市普陀区金沙江路 1518 弄"
        },
        {
          omptime: "2019年11月11日",
          ompname: "王者荣耀1518",
          omptype: "签名",
          ompinfo: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  created() {
    this.onSubmit();
  },
  methods: {
    onSubmit() {
      console.log(this.$route.query.info);
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
