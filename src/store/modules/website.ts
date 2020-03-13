import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators"

import store from "@/store"

export interface IWebsiteState {
  // history: object[]
}

@Module({ dynamic: true, store, name: "website" })
class Website extends VuexModule implements IWebsiteState {
  private history: object[] = []
  private historyCapacity: number = 2

  @Mutation
  private ADD_HISTORY(path: object) {
    if (this.history.length + 1 > this.historyCapacity) {
      this.history.shift()
    }
    this.history.push(path)
  }
  @Action
  public AddHistory(path: object) {
    this.ADD_HISTORY(path)
  }
  @Action
  public async GetHistory(index: number) {
    const len: number = this.history.length
    let real_index: number = len + index
    if (len > 1) {
      real_index %= len
    }
    return this.history[real_index]
  }
}

export const WebsiteMudule = getModule(Website)
