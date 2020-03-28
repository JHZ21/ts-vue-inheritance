<template>
  <div class="competition-box">
    <div class="competition-content">
      <div class="project-name"> {{PName}}
      </div>
      <section class="project-content">
        <div class="project-content-item"
          v-for="(content_item, item_k) in content"
          :key="item_k">
          <div class="item-title">{{content_item.title}}</div>
          <div class="item-content">
            <p v-for="(str,i) in content_item.content"
              :key="i">{{str}}</p>
          </div>
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
import {
  ProjectContentItemType,
  ProjectMemberType,
  ProjectTeamType
} from "./type"
import { UserModule } from "@/store/modules/user"
import { id_random, resSuccess } from "@/utils/func"
import * as Compet from "@/api/compet"
import * as Forage from "@/utils/localForage"
import { CommonMixin } from "@/utils/mixins"
import { UpdateStoreDataType, GetDataType } from "@/utils/interface"

@Component({
  name: "CompetitionContent",
  components: {
    ProjectSteps
  },
  mixins: [CommonMixin]
})
export default class extends Vue {
  user_id: string = ""
  PId: string = ""
  PName: string = ""
  TName: string = ""
  content: ProjectContentItemType[] = []
  team: ProjectTeamType = []
  default_step_data: StepDataType = {
    deadline: "2-21-2020",
    description:
      "这是一段很长很长很长的描述性文字。这是一段很长很长很长的描述性文字。"
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
    this.content = project.content || []
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
