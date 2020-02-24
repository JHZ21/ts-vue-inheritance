import Vue from "vue"
import Vuex from "vuex"
import { ILearnState } from "./modules/learn"
import { IUserState } from "./modules/user"

Vue.use(Vuex)

export interface IRootState {
  learn: ILearnState
  user: IUserState
}

// Declare empty store first, dynamically register all modules later;
export default new Vuex.Store<IRootState>({})
