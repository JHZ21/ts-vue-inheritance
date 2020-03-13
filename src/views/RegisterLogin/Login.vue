<template>
  <wrapper title="欢迎登录">
    <el-form :model="loginForm"
      status-icon
      :rules="loginRules"
      class="demo-ruleForm"
      autocomplete="on"
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
      <switch-page path="/register"
        :right="true">转去注册</switch-page>
    </el-form>
  </wrapper>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator"
import Wrapper from "./componetns/Wrapper.vue"
import SwitchPage from "@/components/SwitchPage.vue"
import { postUserLogin, getUserInfo } from "@/api/user"
import { UserModule } from "@/store/modules/user"
import { UserInfoType } from "@/utils/interface"
import { setLocalForage } from "@/utils/localForage"
import { WebsiteMudule } from "@/store/modules/website"

@Component({
  name: "Login",
  components: {
    Wrapper,
    SwitchPage
  }
})
export default class extends Vue {
  private loginForm = {
    account: "17858881111",
    pass: "1111"
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
        const params = {
          account: this.loginForm.account,
          pw: this.loginForm.pass
        }
        postUserLogin(params).then(async res => {
          if (res && res.data && res.data.code === 200) {
            alert("登陆成功")
            const pathObj: any = await WebsiteMudule.GetHistory(-2)
            const defaultPathObj: any = { path: "learn" }
            if (!pathObj) return this.$router.push(defaultPathObj)
            const path = pathObj.path
            const excludePath: RegExp = /^\/?register/
            if (path && !excludePath.test(path)) {
              // 上个页面存在且合理，则返回
              this.$router.push({
                path
              })
            } else {
              // 不存在上个页面，则返回 default page
              this.$router.push(defaultPathObj)
            }
          } else {
            alert("登陆失败")
          }
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