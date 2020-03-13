<template>
  <div class="header"
    v-if="showHeader()">
    <div class="header_container"
      v-show="showHeaderContent()">
      <ul class="nav">
        <li v-for="(link, key) in links"
          :key="key">
          <router-link :to="link.to">{{ link.text }}</router-link>
        </li>
      </ul>
      <div class="header_right">
        <div class="user_area">
          <div class="header_avator"
            :style="{ backgroundImage: `url(${headUrl})`}">
          </div>
          <span class="user_nav">
            <template v-if="!isLogin">
              <switch-page path="/login">登陆</switch-page>/
              <switch-page path="/register">注册</switch-page>
            </template>
            <template v-else>
              <switch-page path="/login"
                @click.native="signOut()">退出</switch-page>
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator"
import SwitchPage from "@/components/SwitchPage.vue"
import { UserModule } from "@/store/modules/user"
import { userSignOut } from "@/api/user"

interface RouterLink {
  to: string
  text: string
}

@Component({
  name: "Header",
  components: {
    SwitchPage
  }
})
export default class Header extends Vue {
  links: object[] = [
    { to: "/learn", text: "学习区" },
    { to: "/competition", text: "竞赛区" },
    { to: "/plan", text: "规划区" },
    { to: "/partners", text: "伙伴们" },
    { to: "/analysis", text: "分析" }
  ]
  get isLogin(): boolean {
    return UserModule.isLogin
  }
  get headUrl(): string {
    let url: string = ""
    if (UserModule.headUrl) {
      url = UserModule.headUrl
    } else {
      url = require("@/assets/images/gray.jpg")
    }
    return url
  }
  signOut() {
    userSignOut()
    UserModule.UserSignOut()
  }
  showHeaderContent(): boolean {
    // 学习内容页面不显示header 内容
    // return !new RegExp(/^\/learn\/content\//).test(this.$route.fullPath)
    return true
  }
  showHeader(): boolean {
    const hidePath = ["/register", "/login"]
    const path = this.$route.fullPath
    return !hidePath.includes(path)
  }
}
</script>
<style lang="scss" scoped>
.header {
  background-color: $theme-color;
  height: $header-height;
  // height: 40px;
  // background-color: #575a8a;
  .header_container {
    @include layout-width();
    display: flex;
    height: 40px;
    font-size: 14px;
    margin: 0 auto;
    .nav {
      list-style: none;
      margin: 0 auto;
      margin-left: -40px;
      li:nth-child(1) a {
        padding-left: 0;
      }
      li {
        float: left;
        a {
          display: block;
          height: 40px;
          line-height: 40px;
          color: #717a84;
          font-weight: bold;
          padding: 0 18px;
          text-decoration: none;
          &:hover {
            color: #eee;
          }
          &.router-link-exact-active {
            color: #fff;
          }

          @media screen and (max-width: 1479px) {
            & {
              padding: 0 10px !important;
            }
          }
          @media screen and (max-width: 1270px) {
            & {
              padding: 0 5px !important;
            }
          }
        }
      }
    }
  }
}
.header_right {
  float: right;
  display: flex;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .user_area {
    display: flex;
  }
}
.header_avator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: url("~@/assets/images/header_avator.gif");
  // background-image: url("../assets/images/header_avator.gif");
  background-size: 100% 100%;
}
.user_nav {
  margin-left: 15px;
  color: #409eff;
  line-height: 25px;
}
</style>
