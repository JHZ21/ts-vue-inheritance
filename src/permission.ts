import router from "./router"
import { UserModule } from "@/store/modules/user"

router.beforeEach(async (to, from, next) => {
  // 请求UserInfo, store Vuex
  if (!UserModule.roles || UserModule.roles.length < 1) {
    await UserModule.GetUserInfo()
  }
  next()
})
