import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators"
import { getUserInfo } from "@/api/user"
import store from "@/store"

export interface IUserState {
  roles: string[]
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
  public roles: string[] = [] // roles[0] 是 用户的id

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Action
  public async GetUserInfo() {
    // 解构赋值, 获取data值
    const { data } = await getUserInfo({})
    const { id, roles } = data.user
    if (!roles || roles.length <= 0) {
      throw Error("GetUserInfo: roles must be a non-null array!")
    }
    this.SET_ROLES(roles)
  }
}

export const UserModule = getModule(User)
