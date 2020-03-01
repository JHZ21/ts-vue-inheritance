import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators"
import store from "@/store"
import { ProjectDataType } from "@/utils/interface"

export interface ICompetitionState {
  navData: any[]
  allProjects: ProjectDataType[][][]
}

@Module({ dynamic: true, store, name: "competition" })
class Competition extends VuexModule implements ICompetitionState {
  navData: any[] = []
  allProjects: ProjectDataType[][][] = []

  @Mutation
  private SET_NAVDATA(navData: any[]) {
    this.navData = navData
  }

  @Mutation
  private SET_ALLProjects(allProjects: ProjectDataType[][][]) {
    this.allProjects = allProjects
  }

  @Action
  public SetNavData(navData: any[]) {
    this.SET_NAVDATA(navData)
  }

  @Action
  public SetAllProjects(allProjects: ProjectDataType[][][]) {
    this.SET_ALLProjects(allProjects)
  }
}

export const CompetitionModule = getModule(Competition)
