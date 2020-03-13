import Vue from "vue"
import Vuex from "vuex"
import { ILearnState } from "./modules/learn"
import { IUserState } from "./modules/user"
import { IWebsiteState } from "./modules/website"

Vue.use(Vuex)

export interface IRootState {
  learn: ILearnState
  user: IUserState
  website: IWebsiteState
}

// Declare empty store first, dynamically register all modules later;
export default new Vuex.Store<IRootState>({})
