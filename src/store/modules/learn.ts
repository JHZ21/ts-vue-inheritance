import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";

export interface oContentUrlType {
  [propName: string]: string;
}

export interface ILearnState {
  oContentUrl: oContentUrlType;
}

@Module({ dynamic: true, store, name: "learn" })
class Learn extends VuexModule implements ILearnState {
  public oContentUrl = {};
  @Mutation
  private SET_OCONTETNURL(oContentUrl: oContentUrlType) {
    this.oContentUrl = oContentUrl;
  }
  @Action
  public SetOContentUrl(oContentUrl: oContentUrlType) {
    this.SET_OCONTETNURL(oContentUrl);
  }
}

export const LearnModule = getModule(Learn);
