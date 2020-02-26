<template>
  <div class="about">
    <div class="top-panel">
      <div class="top-panel-content">
        <div class="search_box">
          <search-input mode="big"
            placeholder="搜索词 空格隔开/enter"
            @set_search_val="set_search_val"></search-input>
        </div>
        <div class="nav-box">
          <nav-menu class="nav"
            :nav_data="nav_data"
            @update_selected_erea="update_selected_erea"></nav-menu>
        </div>
      </div>
    </div>
    <main class="content">
      <div class="card-box">
        <div class="card-header">
          <div class="team-photo"></div>
          <div class="project-name">
            项目
          </div>
          <div class="project-summary">
            项目概述
          </div>
          <div class="team-name">
            队名
          </div>
          <div class="team-members">
            成员
          </div>
        </div>
        <transition-group class="transition-box"
          name="slide-up">
          <open-new-tab v-for="(project) in currPageProjects"
            :key="project.id"
            :url="new_tab_url(project.id)">
            <project-card :project_data="project"></project-card>
          </open-new-tab>
        </transition-group>
      </div>
      <el-pagination class="pagination"
        background
        layout="prev, pager, next"
        :page-size="pageCardSize"
        :total="currRangeProjects.length"
        :current-page.sync="currentPage"></el-pagination>
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import NavMenu from "@/components/NavMenu.vue"
import SearchInput from "@/components/SearchInput.vue"
import ProjectCard from "@/components/ProjectCard/ProjectCard.vue"
import { ProjectDataType } from "@/utils/interface"
import { getProjects } from "@/api/competition"
import ProjectCardVue from "@/components/ProjectCard/ProjectCard.vue"
import OpenNewTab from "../../../components/OpenNewTab.vue"

@Component({
  name: "Competition",
  components: {
    NavMenu,
    SearchInput,
    ProjectCard,
    OpenNewTab
  }
})
export default class extends Vue {
  //TODO: 此页面与Learn页面结构相似，可是尝试是否可以抽象出, 可能用到solt
  search_val: string = ""
  aSelected: number[] = [0, 0]
  pageCardSize: number = 10
  currentPage: number = 1
  nav_data = [
    {
      label: "比赛:",
      aData: [
        "浙江省大学生多媒体作品设计竞赛",
        "中国大学生计算机设计大赛",
        `中国"互联网+"大学生创新创业大赛`,
        "国创",
        "新苗",
        "春萌"
      ]
    },
    {
      label: "时间:",
      aData: [
        [
          "2020上",
          "2019下",
          "2019上",
          "2018下",
          "2018上",
          "2017下",
          "2017上",
          "2016下",
          "2016上"
        ],
        [
          "2020上",
          "2019下",
          "2019上",
          "2018下",
          "2018上",
          "2017下",
          "2017上",
          "2016下",
          "2016上"
        ],
        [
          "2020上",
          "2019下",
          "2019上",
          "2018下",
          "2018上",
          "2017下",
          "2017上",
          "2016下",
          "2016上"
        ],
        [
          "2020上",
          "2019下",
          "2019上",
          "2018下",
          "2018上",
          "2017下",
          "2017上",
          "2016下",
          "2016上"
        ],
        [
          "2020上",
          "2019下",
          "2019上",
          "2018下",
          "2018上",
          "2017下",
          "2017上",
          "2016下",
          "2016上"
        ],
        [
          "2020上",
          "2019下",
          "2019上",
          "2018下",
          "2018上",
          "2017下",
          "2017上",
          "2016下",
          "2016上"
        ]
      ]
    }
  ]
  allProjects: ProjectDataType[][][] = []
  currRangeProjects: ProjectDataType[] = []

  // 根据aSelected、currentPage 与 search_val 生成 当前页数据
  get currPageProjects(): ProjectDataType[] {
    let projects!: ProjectDataType[]
    const index: number = this.currentPage - 1
    const pageCardSize: number = this.pageCardSize
    const search_val = this.search_val
    projects = this.currRangeProjects.slice(
      index * pageCardSize,
      (index + 1) * pageCardSize
    )
    if (search_val) {
      projects = this.filter_sort_by_search_val(projects, search_val)
    }
    return projects
  }
  // 监听aSelected, 设置当前选择范围的数据
  @Watch("aSelected", { immediate: false, deep: true })
  update_currRangeProjects(aSelected: number[]) {
    if (!this.allProjects[0]) return
    this.currRangeProjects = this.allProjects[aSelected[0]][aSelected[1]]
  }
  new_tab_url(id: number) {
    return `http://localhost:8080/#/competition/content/${id}`
  }
  private _search_count(
    project: ProjectDataType,
    aStr: string[],
    count: symbol
  ) {
    aStr.forEach(str => {
      const aInfo: string[] = [
        project.PName,
        project.PSummary,
        project.TName,
        ...project.TMembers
      ]
      if (aInfo.some(text => text.includes(str))) {
        let obj: any = project
        obj[count] || (obj[count] = 0)
        obj[count]++
      }
    })
  }

  filter_sort_by_search_val(
    projects: ProjectDataType[],
    search_val: string
  ): ProjectDataType[] {
    const count: symbol = Symbol("count")
    const aStr: string[] = search_val.split(" ")
    const self = this
    // 添加标记、计数
    projects.forEach(project => self._search_count(project, aStr, count))
    // 过滤
    projects = projects.filter((project: any) => project[count])
    //排序: 降序
    projects.sort((aPro: any, bPro: any): number => bPro[count] - aPro[count])
    // 清楚标记 count
    projects.forEach((project: any) => delete project[count])
    return projects
  }
  update_selected_erea(aSelected: number[]) {
    this.aSelected = aSelected.slice(0, 2)
  }

  set_search_val(search_val: string) {
    this.search_val = search_val
  }
  created() {
    const CompetitionVue = this
    getProjects().then(res => {
      CompetitionVue.allProjects = res.data
      CompetitionVue.aSelected = [0, 0] // 刷新aSelected
    })
  }
}
</script>

<style lang="scss" scoped>
@import "./Competition.scss";
</style>
