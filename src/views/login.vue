<template>
  <div class="login">
    <div class="logo">
      <div class="login-i">
        <img src="../assets/images/hei_lu_logo.png" />
      </div>
      <div class="login-i-text" id="div_name">沥青混凝土MES智慧生产管控平台</div>
    </div>
    <div class="more_link">
      <a href="http://www.t-mes.com/col.jsp?id=106"><img src="../assets/images/ptjj.png"  alt=""/>平台简介</a>
      <a href="http://www.t-mes.com/col.jsp?id=107"><img src="../assets/images/ptsy.png"  alt=""/>申请试用</a>
      <a href="http://www.t-mes.com/col.jsp?id=107"><img src="../assets/images/lxwm.png" />联系我们</a>
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="goon"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>重庆道软科技有限公司 备案号：渝ICP备18003130号-1</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            this.getCode();
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.png");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  font-size: 30px;
  color: #27c2a5;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  border-radius: 10px;
  overflow: hidden;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.logo {
  max-width: 1200px;
  margin: 0 auto 0 auto;
  display: flex;
  align-items: center;

  position: absolute;
  top: 10%;
  left: -15%;
  width: 100%;
  text-align: right;
  font-size: 12px;
  box-sizing: border-box;
  padding-right: 20px;

  justify-content: flex-end;
}

.logo .login-i {
  margin-right: 20px;
}

.logo .login-i img {
  max-width: 130px;
  max-height: 60px;
}

.logo .login-i-text {
  border-left: 1px solid #ffffff;
  font-size: 25px;
  color: #ffffff;
  padding-left: 20px;
}

.more_link {
  position: absolute;
  top: 20px;
  width: 100%;
  text-align: right;
  font-size: 12px;
  box-sizing: border-box;
  padding-right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.more_link a {
  color: #ffffff;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.more_link a img {
  width: 14px;
  margin-right: 5px;
}

.el-button--goon.is-active,
.el-button--goon:active {
  background: #27c2a5;
  border-color: #27c2a5;
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: #27c2a5;
  border-color: #27c2a5;
  color: #fff;
}

.el-button--goon {
  color: #FFF;
  background-color: #27c2a5;
  border-color: #27c2a5;
}
</style>
