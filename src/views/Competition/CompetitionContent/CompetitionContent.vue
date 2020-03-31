<template>
  <div class="competition-box">
    <div class="competition-content">
      <section class="project-name"> {{PName}}
        <submit-form class="section-submit-form"
          v-if="hasPermission(['admin', id_members[0]])"
          title="项目名"
          openText="修改项目名"
          :prop_form="PNameForm"
          @init_form_data="initPNameForm"
          @upload_form_data="updatePNameForm">
          <el-form>
            <el-input type="text"
              v-model="PNameForm.PName">
            </el-input>
          </el-form>
        </submit-form>
      </section>
      <section class="project-content">
        <div class="project-content-item"
          v-for="(content_item, item_k) in contents"
          :key="item_k">
          <div class="item-title">{{content_item.title}}</div>
          <div class="item-content">
            <p v-for="(str,i) in content_item.content"
              :key="i">{{str}}</p>
          </div>
        </div>
        <div class="section-submit-form"
          v-if="hasPermission(['admin', ...id_members])">
          <el-button type="text"
            @click="contentOpenDialog()">修改项目内容</el-button>
          <el-dialog title="修改项目内容"
            :modal-append-to-body="false"
            :visible.sync="contentForms.dialogFormVisible">
            <el-form :model="contentForms"
              ref="contentForms"
              :label-width="formLabelWidth"
              class="dynamic-form">
              <div class="input-from-wrapper">
                <div v-for="(item, index) in contentForms.contents"
                  :key="item.time|| index">
                  <el-form-item :label="'内容块' + (index+1)"
                    :prop="`contents[${index}].title`"
                    :rules="{
                  required:true, message: '内容名不能为空', trigger: 'blur'
                  }">
                    <el-input v-model="item.title"
                      :readonly="index === 0"
                      placeholder="小标题"></el-input>
                    <el-button type="danger"
                      circle
                      class="icon-btn"
                      v-if="index !==0"
                      icon="el-icon-delete"
                      @click.prevent="contentRemoveItem(item)"></el-button>
                  </el-form-item>
                  <el-form-item :prop="`contents[${index}].content`"
                    :rules="{
                  required: true, message: '内容不能为空', trigger: 'blur'
                 }">
                    <el-input type="textarea"
                      :rows="3"
                      v-model="item.content"
                      placeholder="快输入点什么东西吧">
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <el-form-item>
                <el-button type="primary"
                  @click="contentSubmitForm('contentForms')">提交</el-button>
                <el-button @click="contentAddItem">新增内容块</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </section>
      <section class="project-team">
        <div class="team-name">团队: {{TName}}</div>
        <div class="members-box">
          <div class="team-member"
            v-for="member in team"
            :key="member.userId">
            <div class="member-info">
              <div class="portrait-wrapper">
                <div class="portrait"
                  :style="{ backgroundImage: `url(${member.headUrl})`}"></div>
              </div>
              <div class="introduce">
                <p v-for="(str, str_k) in member.introduce"
                  :key="str_k">{{str}}</p>
              </div>
            </div>
            <div class="member-contribution">
              <p v-for="(str, index) in member.contribution"
                :key="index">{{str}}</p>
            </div>
          </div>
        </div>
      </section>
      <section class="project-code">
        <div class="code-title">项目</div>
        <div class="code-content">
          <el-row class="icon-row"
            v-if='hasPermission(["admin", ...id_members])'>
            <span class="btns-wrapper">
              <el-button icon="el-icon-circle-plus"
                title="insert new"
                @click="plus_project_step(-1)"
                circle></el-button>
            </span>
          </el-row>
          <div class="project-steps-wrapper"
            v-for="(steps_obj, key) in stepsList"
            :key="steps_obj.pleanId">
            <project-steps class="project-steps"
              :steps_obj="steps_obj"
              :isPermission="hasPermission(['admin',id_members[0], steps_obj.master.userId])"
              :key="steps_obj.pleanId"></project-steps>
            <el-row class="icon-row"
              v-if='hasPermission(["admin", ...id_members])'>
              <span class="btns-wrapper">
                <el-button v-if='hasPermission(["admin", id_members[0], steps_obj.master.userId])'
                  icon="el-icon-remove"
                  type="danger"
                  class="danger-btn"
                  :title="`delete ${steps_obj.planName}`"
                  @click="remove_project_step(key, steps_obj.planName)"
                  circle></el-button>
                <el-button v-if='hasPermission(["admin", ...id_members])'
                  icon="el-icon-circle-plus"
                  title="insert new"
                  @click="plus_project_step(key)"
                  circle></el-button>
              </span>
            </el-row>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import ProjectSteps from "@/components/ProjectSteps/ProjectSteps.vue"
import { StepsObjType, StepDataType } from "@/utils/interface"
import { PjContentItemType, ProjectMemberType, ProjectTeamType } from "./type"
import { UserModule } from "@/store/modules/user"
import {
  id_random,
  resSuccess,
  deep_copy,
  isDef,
  isUndef,
  leftArrayDiff
} from "@/utils/func"
import * as Compet from "@/api/compet"
import * as Forage from "@/utils/localForage"
import { CommonMixin } from "@/utils/mixins"
import { UpdateStoreDataType, GetDataType } from "@/utils/interface"
import SubmitForm from "@/components/SubmitForm.vue"
import UpdateFormNum from "@/components/UpdateFormNum.vue"

interface ContentFormsType {
  dialogFormVisible: boolean
  contents: PjContentItemType[]
}

@Component({
  name: "CompetitionContent",
  components: {
    ProjectSteps,
    SubmitForm,
    UpdateFormNum
  },
  mixins: [CommonMixin]
})
export default class extends Vue {
  user_id: string = ""
  PId: string = ""
  PName: string = ""
  TName: string = ""
  contents: PjContentItemType[] = []
  team: ProjectTeamType = []
  default_step_data: StepDataType = {
    deadline: "2-21-2020",
    description:
      "这是一段很长很长很长的描述性文字。这是一段很长很长很长的描述性文字。"
  }
  PNameForm = {
    dialogFormVisible: false,
    PName: ""
  }
  contentForms: ContentFormsType = {
    dialogFormVisible: false,
    contents: [
      {
        PId: this.PId,
        index: 0,
        title: "",
        content: "",
        time: 0
      }
    ]
  }
  formLabelWidth: string = "120px"

  // PNameForm
  initPNameForm() {
    console.log("initPNameForm: ")
    this.PNameForm.PName = this.PName
  }
  async updatePNameForm() {
    let formPName: string = this.PNameForm.PName
    if (!formPName || this.PName === formPName) return
    // update 后端
    // ...
    const res = await Compet.updatePName({ PId: this.PId, PName: formPName })
    if (resSuccess(res)) {
      this.PName = formPName
      this.PNameForm.dialogFormVisible = false
      // 更新本地储存
      this.updateLocalProject({ PName: formPName })
    } else {
      alert("提交失败")
    }
  }

  // contentForms 模块
  contentOpenDialog() {
    this.initContentForms()
    this.setContentForms({ dialogFormVisible: true })
  }
  contentRemoveItem(item: PjContentItemType) {
    const contents: PjContentItemType[] = this.contentForms.contents
    let index = contents.indexOf(item)
    if (index !== -1) {
      contents.splice(index, 1)
    }
  }
  contentSubmitForm(formName: string) {
    ;(this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        this.updatePjContent()
        alert("submit!")
      } else {
        console.log("error submit!!")
        return false
      }
    })
  }
  contentAddItem() {
    this.contentForms.contents.push({
      PId: this.PId,
      index: this.contentForms.contents.length,
      title: "",
      content: "",
      time: Date.now()
    })
  }
  setContentForms(forms: any) {
    if (isUndef(forms)) return
    if (isDef(forms.dialogFormVisible)) {
      this.contentForms.dialogFormVisible = forms.dialogFormVisible
    }
    if (isDef(forms.contents)) {
      this.contentForms.contents = forms.contents
    }
  }
  initContentForms() {
    let contents: PjContentItemType[] = deep_copy(this.contents)
    contents = contents.map(item => {
      if (item.content instanceof Array) {
        item.content = item.content.join("\n")
      }
      return item
    })
    this.setContentForms({ contents, num: contents.length })
  }
  contentFormsToContents(): PjContentItemType[] {
    const contents: PjContentItemType[] = deep_copy(this.contentForms.contents)
    return contents.map((item, index) => {
      if (typeof item.content === "string") {
        item.content = item.content.split("\n")
      }
      item.index = index
      item.time || (item.time = Date.now())
      return item
    })
  }
  contentsGetContentForms() {
    this.contents = this.contentFormsToContents()
  }
  deletedContents(newContents: PjContentItemType[]): PjContentItemType[] {
    function sameFnc(a: any, b: any): boolean {
      return a.time === b.time
    }
    let deletedContents: PjContentItemType[] = leftArrayDiff(
      deep_copy(this.contents),
      newContents,
      sameFnc
    )
    // show 为 false , 即为删除
    deletedContents.forEach(content => {
      content.show = false
      return content
    })
    return deletedContents
  }
  async updatePjContent() {
    // update 后端
    const contents: PjContentItemType[] = this.contentFormsToContents()
    const deletedContents: PjContentItemType[] = this.deletedContents(contents)
    const res = await Compet.updatePjContents({
      contents: [...contents, ...deletedContents]
    })
    console.log("updatePjContent res: ", res)
    if (resSuccess(res)) {
      this.contents = contents
      // 更新本地存储
      // const localPjKey: string = this.projectLocalKey(this.PId)
      // const project: any = (await Forage.getLocalForage(localPjKey)) || {}
      // project.contents = contents
      // Forage.setLocalForage(localPjKey, project)
      this.updateLocalProject({ contents })
      this.setContentForms({ dialogFormVisible: false })
    } else {
      alert("提交失败")
    }
  }
  async updateLocalProject(newProject: any) {
    if (isUndef(newProject)) return
    const { PName, PSummary, contents, team, stepsList } = newProject
    const localPjKey: string = this.projectLocalKey(this.PId)
    const project: any = (await Forage.getLocalForage(localPjKey)) || {}
    PName && (project.PName = PName)
    PSummary && (project.PSummary = PSummary)
    contents && (project.contents = contents)
    team && (project.team = team)
    stepsList && (project.stepsList = stepsList)
    Forage.setLocalForage(localPjKey, project)
  }
  // TODO: 不赋值初值，属性就无法响应！！！
  stepsList: StepsObjType[] = []
  get id_members(): string[] {
    let ids: string[] = []
    if (this.team && this.team) {
      ids = this.team.map(member => member.userId)
    }
    return ids
  }
  default_steps_obj(): StepsObjType {
    let pleanId = id_random()
    return {
      planName: `计划${pleanId}`,
      stepsData: Array(4).fill(this.default_step_data),
      activeNum: 2,
      pleanId,
      master: { userId: this.user_id }
    }
  }
  remove_project_step(plan_key: number, plan_name: string) {
    let is_delete = confirm(`确定删除计划: ${plan_name}!`)
    if (is_delete) {
      this.stepsList.splice(plan_key, 1)
    }
  }
  plus_project_step(plan_key: number) {
    // plan_key = -1, 则往头部添加
    this.stepsList.splice(plan_key + 1, 0, this.default_steps_obj())
  }
  // 从后端更新project
  projectLocalKey(PId: string) {
    return `project-${PId}`
  }
  updateStoreData!: UpdateStoreDataType
  // update 且 setlocal
  async updateStoreCompetProject(PId: string) {
    const localKey = this.projectLocalKey(PId)
    return this.updateStoreData(Compet.getProject, { PId }, localKey, "project")
  }
  async updateSetCompetProject(PId: string) {
    this.setProject(await this.updateStoreCompetProject(PId))
  }
  getData!: GetDataType
  async getCompetProject(PId: string) {
    return this.getData(this.updateStoreCompetProject, PId, `project-${PId}`)
  }
  async getSetProject(PId: string) {
    this.setProject(await this.getCompetProject(PId))
  }
  // 分离 set
  // TODO: 项目块名，也应使用后端的数据
  setProject(project: any) {
    if (!project) return ""
    this.PName = project.PName || "项目名"
    this.TName = project.TName || "队名"
    this.contents = project.contents || []
    this.team = project.team || []
    this.stepsList = project.stepsList || []
  }
  created() {
    this.PId = this.$route.params.id
    this.getSetProject(this.PId)
    this.user_id = UserModule.userId
  }
}
</script>

<style lang="scss" scoped>
@import "./CompetitionContent.scss";
</style>
