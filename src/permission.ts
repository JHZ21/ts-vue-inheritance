import router from "./router"
import { UserModule } from "@/store/modules/user"

router.beforeEach(async (to, from, next) => {
  // 请求UserInfo, store Vuex
  // if (!UserModule.roles || UserModule.roles.length < 1) {
  //   await UserModule.GetUserInfo()
  // }
  // 未登录状态时，尝试登陆
  const excludePath = ["/login", "/register"]
  if (!excludePath.includes(to.path)) {
    if (!UserModule.isLogin) {
      await UserModule.GetUserInfo()
    }
  }

  next()
})
