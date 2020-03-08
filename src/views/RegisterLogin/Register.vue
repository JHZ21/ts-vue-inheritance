<template>
  <wrapper title="欢迎注册">
    <el-form :model="registerForm"
      status-icon
      :rules="registerRules"
      class="demo-ruleForm"
      ref="registerForm">
      <el-form-item prop="account">
        <el-input type="number"
          prefix-icon="el-icon-user-solid"
          placeholder="手机号"
          :autofocus="true"
          v-model="registerForm.account"
          autocomplete="on"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password"
          prefix-icon="el-icon-lock"
          placeholder="密码"
          v-model="registerForm.pass"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password"
          prefix-icon="el-icon-lock"
          placeholder="确认密码"
          v-model="registerForm.checkPass"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          class="submit-btn"
          @click="submitForm('registerForm')">注册</el-button>
      </el-form-item>
      <switch-page msg="转去登录"
        path="/login"></switch-page>
    </el-form>
  </wrapper>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator"
import Wrapper from "./componetns/Wrapper.vue"
import SwitchPage from "./componetns/SwitchPage.vue"
import { postUserRegister } from "@/api/user"

@Component({
  name: "Register",
  components: {
    Wrapper,
    SwitchPage
  }
})
export default class extends Vue {
  private registerForm = {
    account: "",
    pass: "",
    checkPass: ""
  }
  private registerRules = {
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
    ],
    checkPass: [
      {
        validator: this.validateCheckPass,
        trigger: "blur"
      }
    ]
  }
  private validateAccount(rule: any, value: string, callback: Function) {
    const iphoneReg: RegExp = /^1\d{10}$/
    let isValid = iphoneReg.test(value)
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
      if (this.registerForm.checkPass !== "") {
        ;(this.$refs.registerForm as any).validateField("checkPass")
      }
      callback()
    }
  }
  private validateCheckPass(rule: any, value: string, callback: Function) {
    if (value === "") {
      callback(new Error("请再次输入密码"))
    } else if (value !== this.registerForm.pass) {
      callback(new Error("两次输入密码不一致!"))
    } else {
      callback()
    }
  }
  private submitForm(formName: string) {
    ;(this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        const params = {
          account: this.registerForm.account,
          pw: this.registerForm.pass
        }
        postUserRegister(params).then(res => {
          if (res && res.data && res.data.code === 200) {
            alert("账号注册成功")
          } else {
            alert(`注册失败：${res.data.msg}`)
          }
          console.log(res)
        })
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
    Object.keys(this.registerForm).forEach(key => {
      ;(this.registerForm as any)[key] = ""
    })
    this.resetForm("registerForm")
  }
}
</script>

<style lang='scss' scoped>
.submit-btn {
  width: 100%;
}
</style>