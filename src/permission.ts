import router from "./router"
import { UserModule } from "@/store/modules/user"
import { WebsiteMudule } from "@/store/modules/website"
import { Form } from "element-ui"

router.beforeEach(async (to, from, next) => {
  WebsiteMudule.AddHistory({
    path: to.path
  })
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
