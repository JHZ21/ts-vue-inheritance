import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators"
import store from "@/store"
import { UserInfoType } from "@/utils/interface"
import { getUserInfo } from "@/api/user"
import { resSuccess } from "@/utils/func"

export interface IUserState {
  isLogin: boolean
  name: string
  headUrl: string
  roles: string[]
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
  public isLogin = false
  public name = ""
  public headUrl = ""
  public roles: string[] = [] // roles[0] 是 用户的id

  @Mutation
  private SET_ISLOGIN(isLogin: boolean) {
    this.isLogin = isLogin
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_HEADURL(headUrl: string) {
    this.headUrl = headUrl
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Action
  public SetUserInfo(userInfo: UserInfoType) {
    this.SET_ISLOGIN(userInfo.isLogin)
    this.SET_NAME(userInfo.name)
    this.SET_HEADURL(userInfo.headUrl)
    this.SET_ROLES(userInfo.roles)
  }
  @Action
  public UserSignOut() {
    this.SetUserInfo({
      isLogin: false,
      name: this.name,
      headUrl: require("@/assets/images/gray.jpg"),
      roles: ["tourist"]
    })
  }
  @Action
  public async GetUserInfo() {
    const res: any = await getUserInfo()
    if (resSuccess(res)) {
      const userInfo: any = res.data.userInfo
      userInfo.isLogin = true
      userInfo.roles.push("tourist", userInfo.userId)
      this.SetUserInfo(userInfo)
      console.log("get userInof success")
    } else {
      this.UserSignOut()
      console.log("get userInfo failed")
    }
  }
}

export const UserModule = getModule(User)
