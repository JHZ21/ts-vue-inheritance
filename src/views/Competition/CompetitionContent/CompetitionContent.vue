<template>
  <div class="competition-box">
    <div class="competition-content">
      <section class="project-name"> {{PName}}
        <dialog-dynamic-form v-if="hasPermission(['admin', ...id_members[0]])"
          :visible.sync="PNameForm.dialogFormVisible"
          :model="PNameForm"
          title="项目名"
          open-text="修改项目名"
          :is-add-btn="false"
          @open-dialog="initPNameForm"
          @submit-form="updatePNameForm">
          <el-form-item prop="PName"
            :rules="{
              required:true, message: '项目名不能为空', trigger: 'blur'
            }">
            <el-input type="text"
              v-model="PNameForm.PName">
            </el-input>
          </el-form-item>
        </dialog-dynamic-form>
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
        <dialog-dynamic-form v-if="hasPermission(['admin', ...id_members])"
          :visible.sync="contentsForm.dialogFormVisible"
          :model="contentsForm"
          :label-width="formLabelWidth"
          title="项目内容"
          open-text="修改项目内容"
          add-item-text="新增内容块"
          @open-dialog="contentOpenDialog"
          @submit-form="submitContentsForm"
          @add-item="contentAddItem">
          <div class="input-from-wrapper">
            <div v-for="(item, index) in contentsForm.contents"
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
        </dialog-dynamic-form>
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
        <dialog-dynamic-form v-if="hasPermission(['admin', ...id_members])"
          :visible.sync="teamForm.dialogFormVisible"
          :model="teamForm"
          :label-width="formLabelWidth"
          title="我的信息"
          open-text="修改我的信息"
          :is-add-btn="userId === id_members[0]"
          add-item-text="新增成员"
          @open-dialog="initTeamForm"
          @submit-form="submitTeamForm"
          @add-item="addMember">
          <div class="input-from-wrapper">
            <el-form-item label="介绍"
              prop="me.introduce"
              :rules="{
                  required:true, message: '介绍不能为空', trigger: 'blur'
                  }">
              <el-input type="textarea"
                :rows="5"
                v-model="teamForm.me.introduce"
                placeholder="快来写点什么吧..."></el-input>
            </el-form-item>
            <el-form-item label="团队贡献"
              prop="me.contribution"
              :rules="{
                  required: true, message: '团队贡献不能为空', trigger: 'blur'
                 }">
              <el-input type="textarea"
                :rows="5"
                v-model="teamForm.me.contribution"
                placeholder="快写入点什么吧...">
              </el-input>
            </el-form-item>
          </div>
        </dialog-dynamic-form>
      </section>
      <section class="project-code">
        <div class="code-title">项目</div>
        <div class="code-content">
          <div class="project-steps-wrapper"
            v-for="(steps_obj, key) in stepsList"
            :key="steps_obj.pleanId">
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
            <project-steps class="project-steps"
              :steps_obj.sync="steps_obj"
              @update-steps="updateStepsData"
              :isPermission="hasPermission(['admin',id_members[0], steps_obj.master.userId])"
              :key="steps_obj.pleanId"></project-steps>
          </div>
          <el-row class="icon-row"
            v-if='hasPermission(["admin", ...id_members])'>
            <span class="btns-wrapper">
              <el-button icon="el-icon-circle-plus"
                title="insert new"
                @click="plus_project_step(stepsList.length)"
                circle></el-button>
            </span>
          </el-row>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
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
import DialogDynamicForm from "@/components/DialogDynamicForm.vue"

interface ContentFormsType {
  dialogFormVisible: boolean
  contents: PjContentItemType[]
}

const placeholder: string = "\u200b"

@Component({
  name: "CompetitionContent",
  components: {
    ProjectSteps,
    SubmitForm,
    UpdateFormNum,
    DialogDynamicForm
  },
  mixins: [CommonMixin]
})
export default class extends Vue {
  userId: string = ""
  PId: string = ""
  PName: string = placeholder
  TName: string = ""
  contents: PjContentItemType[] = [
    {
      content: [placeholder],
      title: "项目简介",
      PId: "128320832",
      index: 0,
      time: 13298923932342
    }
  ]

  team: ProjectTeamType = [
    {
      introduce: [],
      contribution: [],
      PId: "128320832",
      userId: "7354d9ca7a0b13cd",
      index: 0,
      headUrl: ""
    }
  ]

  default_step_data: StepDataType = {
    deadline: "2-21-2020",
    description:
      "这是一段很长很长很长的描述性文字。这是一段很长很长很长的描述性文字。",
    time: 0
  }
  stepsList: StepsObjType[] = []

  formLabelWidth: string = "120px"

  PNameForm = {
    dialogFormVisible: false,
    PName: ""
  }
  contentsForm: ContentFormsType = {
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

  teamForm = {
    dialogFormVisible: false,
    me: {
      introduce: "",
      contribution: ""
    },
    addMembers: [],
    deleteDMembers: []
  }
  // TODO: 不赋值初值，属性就无法响应！！！

  get id_members(): string[] {
    let ids: string[] = []
    if (this.team && this.team) {
      ids = this.team.map(member => member.userId)
    }
    return ids
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
  // PNameForm
  initPNameForm() {
    this.PNameForm.PName = this.PName
  }
  async updatePNameForm(valid: boolean) {
    if (!valid) return
    let formPName: string = this.PNameForm.PName
    if (this.PName === formPName) return
    // update 后端
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

  // contentsForm 模块
  contentOpenDialog() {
    this.initContentForms()
  }
  contentRemoveItem(item: PjContentItemType) {
    const contents: PjContentItemType[] = this.contentsForm.contents
    let index = contents.indexOf(item)
    if (index !== -1) {
      contents.splice(index, 1)
    }
  }
  contentAddItem() {
    this.contentsForm.contents.push({
      PId: this.PId,
      index: this.contentsForm.contents.length,
      title: "",
      content: "",
      time: Date.now()
    })
  }
  setContentForms(forms: any) {
    if (isUndef(forms)) return
    if (isDef(forms.dialogFormVisible)) {
      this.contentsForm.dialogFormVisible = forms.dialogFormVisible
    }
    if (isDef(forms.contents)) {
      this.contentsForm.contents = forms.contents
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
    const contents: PjContentItemType[] = deep_copy(this.contentsForm.contents)
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
  async submitContentsForm(valid: boolean) {
    if (!valid) return
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
      this.updateLocalProject({ contents })
      alert("提交成功")
      this.setContentForms({ dialogFormVisible: false })
    } else {
      alert("提交失败")
    }
  }

  get teamMyIndex(): number {
    return this.id_members.indexOf(this.userId)
  }
  // teamForm 模块
  initTeamForm() {
    console.log("initTeamForm")
    const { introduce, contribution } = this.team[this.teamMyIndex]
    const { me } = this.teamForm
    me.introduce = introduce.join("\n")
    me.contribution = contribution.join("\n")
  }
  teamFormToMember(): ProjectMemberType {
    const { me } = this.teamForm
    const myInfo: ProjectMemberType = deep_copy(this.team[this.teamMyIndex])
    myInfo.introduce = me.introduce.split("\n")
    myInfo.contribution = me.contribution.split("\n")
    return myInfo
    // this.updateLocalProject({ team: this.team })
  }
  async submitTeamForm(valid: boolean) {
    if (!valid) return
    // udpate 后端
    const res = await Compet.updateTeam({
      PId: this.PId,
      me: this.teamFormToMember(),
      addMembers: null,
      deletedMembers: null
    })
    if (resSuccess(res)) {
      const { team } = res.data
      if (team) {
        this.team = team
        this.updateLocalProject({ team })
      }
      alert("提交成功")
      this.teamForm.dialogFormVisible = false
    } else {
      alert("提交失败")
    }
  }
  addMember() {}

  // steps 模块
  async updateStepsData(newStepObj: StepsObjType) {
    console.log("updateStepsData")
    // update 后端
    const res = await Compet.updateSteps(newStepObj)
    console.log("updateSteps res: ", res)
    if (resSuccess(res)) {
      Vue.set(this.stepsList, newStepObj.index, newStepObj)
      this.updateLocalProject({ stepsList: this.stepsList })
      alert("提交成功")
    } else {
      alert("提交失败")
    }
  }

  default_steps_obj(index: number): StepsObjType {
    let pleanId = id_random()
    return {
      PId: this.PId,
      index,
      planName: `计划${pleanId}`,
      stepsData: Array(1).fill(this.default_step_data),
      activeNum: 0,
      pleanId,
      master: { userId: this.userId }
    }
  }
  @Watch("stepsList.length", { deep: true })
  onStepsList() {
    const stepsList: StepsObjType[] = this.stepsList
    //index 重新赋值
    if (stepsList && stepsList.length > 0) {
      stepsList.forEach((steps, index) => {
        steps.index = index
      })
    }
  }
  async remove_project_step(plan_key: number, plan_name: string) {
    let is_delete = confirm(`确定删除计划: ${plan_name}!`)
    if (is_delete) {
      const params: any = {
        PId: this.PId,
        pleanId: this.stepsList[plan_key].pleanId
      }
      const res = await Compet.deleteSteps(params)
      if (resSuccess(res)) {
        this.stepsList.splice(plan_key, 1)
        this.updateLocalProject({ stepsList: this.stepsList })
      } else {
        alert("删除失败")
      }
    }
  }
  plus_project_step(plan_key: number) {
    // plan_key = -1, 则往头部添加
    this.stepsList.splice(plan_key, 0, this.default_steps_obj(plan_key))
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
    this.userId = UserModule.userId
  }
}
</script>

<style lang="scss" scoped>
@import "./CompetitionContent.scss";
</style>
