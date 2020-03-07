<template>
  <wrapper title="欢迎登录">
    <el-form :model="loginForm"
      status-icon
      :rules="loginRules"
      class="demo-ruleForm"
      ref="loginForm">
      <el-form-item prop="account">
        <el-input type="number"
          prefix-icon="el-icon-user-solid"
          placeholder="手机号"
          :autofocus="true"
          v-model="loginForm.account"
          autocomplete="on"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password"
          prefix-icon="el-icon-lock"
          placeholder="密码"
          v-model="loginForm.pass"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          class="submit-btn"
          @click="submitForm('loginForm')">登录</el-button>
      </el-form-item>
      <switch-page msg="转去注册"
        path="/register"></switch-page>
    </el-form>
  </wrapper>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator"
import Wrapper from "./componetns/Wrapper.vue"
import SwitchPage from "./componetns/SwitchPage.vue"

@Component({
  name: "Login",
  components: {
    Wrapper,
    SwitchPage
  }
})
export default class extends Vue {
  private loginForm = {
    account: "",
    pass: ""
  }
  private loginRules = {
    account: [
      {
        validator: this.validateAccount,
        trigger: "blur"
      }
    ],
    pass: [
      {
        validator: this.validatePass,
        trigger: "blur"
      }
    ]
  }
  private validateAccount(rule: any, value: string, callback: Function) {
    const iphoneReg: RegExp = /^1\d{10}$/
    let isValid = value.match(iphoneReg)
    if (isValid) {
      callback()
    } else {
      if (value.length !== 11) {
        callback(new Error("手机号长度未正确"))
      } else {
        callback(new Error("手机号不规范"))
      }
    }
  }
  private validatePass(rule: any, value: string, callback: Function) {
    if (value === "") {
      callback(new Error("请输入密码"))
    } else {
      callback()
    }
  }

  private submitForm(formName: string) {
    ;(this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        alert("submit")
      } else {
        console.log("err submit !!!")
        return false
      }
    })
  }
  resetForm(formName: string) {
    ;(this.$refs[formName] as any).resetFields()
  }
  deactivated() {
    Object.keys(this.loginForm).forEach(key => {
      ;(this.loginForm as any)[key] = ""
    })
    this.resetForm("loginForm")
  }
}
</script>

<style lang='scss' scoped>
.submit-btn {
  width: 100%;
}
</style>