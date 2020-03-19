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
      <div class="fixed-right-box">
        <el-pagination class="pagination"
          background
          layout="prev, pager, next"
          :page-size="pageCardSize"
          :total="currRangeProjects.length"
          :current-page.sync="currentPage">

        </el-pagination>
        <add-card title="新增项目"
          v-if="isLogin"
          :prop_form="form"
          @init_form_data="init_form_data"
          @upload_form_data="upload_form_data">
          <el-form :model="form">
            <el-form-item>
              <el-input v-model="form.PName"
                autocomplete="off">
                <template slot="prepend">项目名</template></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.PSummary"
                autocomplete="off"><template slot="prepend">项目概述</template></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.TName"
                autocomplete="off"><template slot="prepend">队名</template></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.searchMember"
                autocomplete="off"><template slot="prepend">添加成员</template></el-input>
            </el-form-item>
            <el-form-item>
              <el-upload class="upload-demo"
                drag
                list-type="picture"
                :auto-upload="true"
                name="img"
                ref="upload"
                :before-upload="save_img"
                :http-request="()=>{}"
                :limit="1"
                action="xx">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip"
                  slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </add-card>
      </div>
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
import OpenNewTab from "@/components/OpenNewTab.vue"
import AddCard from "@/components/AddCard.vue"
import { AddCardMixin, CommonMixin } from "@/utils/mixins"
import axios from "axios"
import { deep_copy } from "@/utils/func"
import {
  getLocalForage,
  getVailLocalForage,
  setLocalForage
} from "@/utils/localForage"
import { CompetitionModule } from "@/store/modules/competition"

interface ProjectFormType {
  PName: string
  PSummary: string
  TName: string
  TMembers: string[]
  searchMember: ""
  img: any
  dialogFormVisible: boolean
}

@Component({
  name: "Competition",
  components: {
    NavMenu,
    SearchInput,
    ProjectCard,
    OpenNewTab,
    AddCard
  },
  mixins: [AddCardMixin, CommonMixin]
})
export default class extends Vue {
  //TODO: 此页面与Learn页面结构相似，可是尝试是否可以抽象出, 可能用到solt
  search_val: string = ""
  aSelected: number[] = [0, 0]
  pageCardSize: number = 10
  currentPage: number = 1
  nav_data: any = []
  allProjects: ProjectDataType[][][] = []
  currRangeProjects: ProjectDataType[] = []
  //dialog form
  form: ProjectFormType = {
    PName: "",
    PSummary: "",
    TName: "",
    TMembers: [],
    searchMember: "",
    img: null,
    dialogFormVisible: false
  }
  default_form_data: any = {}

  upload_form_data() {
    let form = this.form
    let formdata: FormData = new FormData()
    formdata.append("PName", form.PName)
    formdata.append("PSummary", form.PSummary)
    formdata.append("TName", form.TName)
    formdata.append("TMembers", JSON.stringify(form.TMembers))
    formdata.append("aSelected", JSON.stringify(this.aSelected))
    formdata.append("img", form.img)
    axios({
      method: "post",
      url: "http://localhost:2127/image",
      data: formdata
    })
      .then(res => {
        console.log("res.data:", res.data)
        this.form.dialogFormVisible = false
      })
      .catch(err => {
        console.log(err)
      })
  }
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
    return `${process.env.VUE_APP_BASE_PATH}/#/competition/content/${id}`
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
  get_competitions_data() {
    let competitions_data_key: string = "competitions_data"
    getVailLocalForage(competitions_data_key)
      .then(local_data => {
        if (local_data) {
          console.log("getVailLocalForage", competitions_data_key)
          CompetitionModule.SetNavData(
            (local_data as { nav_data: any }).nav_data
          )
          CompetitionModule.SetAllProjects(
            (local_data as { allProjects: any }).allProjects
          )
          return local_data
        } else {
          return getProjects().then(res => {
            let data: {
              nav_data: any
              allProjects: any
            } = res.data
            if (data && data.allProjects) {
              console.log("get newtork")
              setLocalForage(competitions_data_key, data)
              CompetitionModule.SetNavData(data.nav_data)
              CompetitionModule.SetAllProjects(data.allProjects)
              return data
            }
          })
        }
      })
      .then(data => {
        this.nav_data = CompetitionModule.navData
        this.allProjects = CompetitionModule.allProjects
        this.aSelected = [0, 0] // 刷新aSelected
      })
      .catch(err => {
        console.log(err)
      })
  }
  created() {
    const CompetitionVue = this
    this.default_form_data = deep_copy(this.form)
    this.get_competitions_data()
    // getProjects().then(res => {
    //   const data = res.data
    //   setTimeout(() => {
    //     CompetitionVue.nav_data = data.nav_data
    //     CompetitionVue.allProjects = data.allProjects
    //     CompetitionVue.aSelected = [0, 0] // 刷新aSelected
    //   }, 1000)
    // })
  }
}
</script>

<style lang="scss" scoped>
@import "./Competition.scss";
</style>
