<template>
  <div class="competition-box">
    <div class="competition-content">
      <div class="project-name"> {{project_name}}
      </div>
      <section class="project-content">
        <div class="project-content-item"
          v-for="(content_item, item_k) in content_items"
          :key="item_k">
          <div class="item-title">{{content_item.title}}</div>
          <div class="item-content">
            <p v-for="(str,i) in content_item.content"
              :key="i">{{str}}</p>
          </div>
        </div>
      </section>
      <section class="project-team">
        <div class="team-name">{{team.team_name}}</div>
        <div class="members-box">
          <div class="team-member"
            v-for="(member, index) in team.members"
            :key="index">
            <div class="member-info">
              <div class="portrait-wrapper">
                <div class="portrait"
                  :style="{ backgroundImage: `url(${member.portrait})`}"></div>
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
            v-for="(steps_obj, key) in steps_objs"
            :key="steps_obj.id">
            <project-steps class="project-steps"
              :steps_obj="steps_obj"
              :isPermission="hasPermission(['admin',id_members[0], steps_obj.master])"
              :key="steps_obj.id"></project-steps>
            <el-row class="icon-row"
              v-if='hasPermission(["admin", ...id_members])'>
              <span class="btns-wrapper">
                <el-button v-if='hasPermission(["admin", id_members[0], steps_obj.master])'
                  icon="el-icon-remove"
                  class="danger-btn"
                  :title="`delete ${steps_obj.plan_name}`"
                  @click="remove_project_step(key, steps_obj.plan_name)"
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
import { id_random } from "@/utils/func"
import { getProjectContent } from "@/api/compet"
import { CommonMixin } from "@/utils/mixins"

@Component({
  name: "CompetitionContent",
  components: {
    ProjectSteps
  },
  mixins: [CommonMixin]
})
export default class extends Vue {
  user_id: string = ""
  project_id: string = ""
  project_name: string = ""
  content_items: ProjectContentItemType[] = []
  team: ProjectTeamType = {
    team_name: "",
    members: []
  }
  default_step_data: StepDataType = {
    deadline: "2-21-2020",
    description:
      "这是一段很长很长很长的描述性文字。这是一段很长很长很长的描述性文字。"
  }
  // TODO: 不赋值初值，属性就无法响应！！！
  steps_objs: StepsObjType[] = []
  get id_members(): string[] {
    let ids: string[] = []
    if (this.team && this.team.members) {
      ids = this.team.members.map(member => member.id)
    }
    return ids
  }
  default_steps_obj(): StepsObjType {
    let id = id_random()
    return {
      plan_name: `计划${id}`,
      power: false,
      steps_data: Array(4).fill(this.default_step_data),
      activeNum: 2,
      id,
      master: this.user_id
    }
  }
  remove_project_step(plan_key: number, plan_name: string) {
    let is_delete = confirm(`确定删除计划: ${plan_name}!`)
    if (is_delete) {
      this.steps_objs.splice(plan_key, 1)
    }
  }
  plus_project_step(plan_key: number) {
    // plan_key = -1, 则往头部添加
    this.steps_objs.splice(plan_key + 1, 0, this.default_steps_obj())
  }
  created() {
    this.project_id = this.$route.params.id
    let params: object = {
      project_id: this.project_id
    }
    getProjectContent(params).then(res => {
      let data = res.data
      let { project_name, content_items, team, steps_objs } = data

      this.project_name = project_name
      this.content_items = content_items
      this.team = team
      this.steps_objs = steps_objs
    })
    this.user_id = UserModule.roles[0]
  }
}
</script>

<style lang="scss" scoped>
@import "./CompetitionContent.scss";
</style>
