<template>
  <div class="container">
    <el-form ref="form" class="formCont omptable" :model="form" label-width="80px">
      <el-col :span="12">
        <el-form-item label="用户ID">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="启用">
         <el-checkbox v-model="form.checked">开启</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        pwd: "",
        checked: true,
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
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
