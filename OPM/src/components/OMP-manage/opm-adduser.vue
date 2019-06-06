<template>
  <div class="container">
    <el-form ref="form" class="formCont omptable" :model="form" label-width="80px">
      <el-col :span="12">
        <el-form-item label="用户名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.checket" :active-text="text" @change="textchange"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
        checket: true
      },
      text: "开启状态"
    };
  },
  methods: {
    textchange() {
      console.log(this.text);
      if (this.form.checket == true) {
        this.text = "开启状态";
      } else {
        this.text = "禁用状态";
      }
    },
    onSubmit() {
      var that = this;
      var forms = new FormData();
      forms.append("username", this.form.name);
      forms.append("password", this.form.pwd);
      forms.append("enabled", this.form.checket);
      console.log(this.form.checket);
      this.axios
        .post("api/opm/user/createorupdate", forms, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          if (res.data.Code !== 0) {
            this.$message.error("错误信息：" + res.data.Message);
          } else {
            this.$message({
              message: res.data.Message,
              type: "success"
            });
            setTimeout(function() {
              // that.$router.push("/omp-userlist");
            }, 1000);
          }
        })
        .catch(err => {
          this.$message.error(res.data.Message);
        });
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
