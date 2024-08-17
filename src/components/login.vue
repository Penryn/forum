<template>
  <div class="container">
    <h1>用户登录</h1>
    <form class="form">
      <div class="form-group">
        <label class="label">用户名</label>
        <el-input v-model="username" class="input" placeholder="请输入账号" />
      </div>
      <br />
      <div class="form-group">
        <label class="label">密码</label>
        <el-input type="password" v-model="password" class="input" placeholder="请输入密码" /> 
      </div>
      <br />
      <div class="button-group">
        <el-button type="primary" @click="login" icon="Search">登录</el-button>
        <el-button type="primary" @click="clean" icon="Delete">清空</el-button>
      </div>
    </form>
  </div>
</template>





<script setup lang="ts">
import { ref } from "vue";
import loginService from "../apis/loginService";
import loginStore from "../stores/loginStore";
import userStore from "../stores/userStore";
import { ElMessage } from 'element-plus'
import  router from "../routers";

const username = ref("");
const password = ref("");
const newLoginStore = loginStore();
const newUserStore = userStore();
const loginSuccess = () => {
  ElMessage({
    message: '登录成功',
    type: 'success',
    plain: true,
  })
}
const loginError = () => {
  ElMessage({
    message: '登录失败',
    type: 'error',
    plain: true,
  })
}

const login = async () => {
  const loginInfo = {
    username: username.value,
    password: password.value,
  };

  const response = await loginService.login(loginInfo);
  if (response.status === 200 && response.data.code === 200&&(response.data.data.user_type==1||response.data.data.user_type==2)) {
    newLoginStore.setLogin(true);
    var id = response.data.data.user_id;
    var name = loginInfo.username;
    var type = response.data.data.user_type;
    var pass = loginInfo.password;
    newUserStore.setUserInfo({
      id: id,
      username: name,
      user_type: type,
      password: pass
    });
    loginSuccess();
    if (response.data.data.user_type == 1) {
      router.push({ path: '/user/post' });
    }else{
      router.push({ path: '/admin/post' });
    }

  } else {
    loginError();
  }
}

const clean = () => {
  username.value = "";
  password.value = "";
}

</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.label {
  width: 50px;
  text-align: right;
  margin-right: 10px;
}

.input {
  flex: 1;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* 控制按钮间距 */
  margin-top: 20px;
}

.el-button {
  flex: 1; /* 使按钮均匀分布 */
}
</style>
