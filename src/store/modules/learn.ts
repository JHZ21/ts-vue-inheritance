import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators"
import store from "@/store"

export interface oContentUrlType {
  [propName: string]: string
}

export interface ILearnState {
  oContentUrl: oContentUrlType | null
}

@Module({ dynamic: true, store, name: "learn" })
class Learn extends VuexModule implements ILearnState {
  public oContentUrl: oContentUrlType | null = null
  @Mutation
  private SET_OCONTETNURL(oContentUrl: oContentUrlType) {
    this.oContentUrl = oContentUrl
  }
  @Action
  public SetOContentUrl(oContentUrl: oContentUrlType) {
    return this.SET_OCONTETNURL(oContentUrl)
  }
}

export const LearnModule = getModule(Learn)
