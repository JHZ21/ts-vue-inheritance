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
              <p>打法的非法，大风啊我发</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
            </div>
          </div>
        </div>
      </section>
      <section class="project-code">
        <div class="code-title">项目</div>
        <div class="code-content">
          <el-row class="icon-row"
            v-if="power">
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
              :key="steps_obj.id"></project-steps>
            <el-row class="icon-row"
              v-if="power">
              <span class="btns-wrapper">
                <el-button icon="el-icon-remove"
                  class="danger-btn"
                  :title="`delete ${steps_obj.plan_name}`"
                  @click="remove_project_step(key, steps_obj.plan_name)"
                  circle></el-button>
                <el-button icon="el-icon-circle-plus"
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

interface ProjectContentItemType {
  title: string
  content: string[]
}

interface ProjectMemberType {
  portrait: string
  introduce: string[]
  contribution: string[]
}

interface ProjectTeamType {
  team_name: string
  members: ProjectMemberType[]
}

// 可用于Mockjs
// interface ProjectContentType {
//   project_name: string
//   content_items: ProjectContentItemType[]
//   team: ProjectTeamType
// }

@Component({
  name: "CompetitionContent",
  components: {
    ProjectSteps
  }
})
export default class extends Vue {
  power: boolean = false
  project_name: string = ""
  content_items!: ProjectContentItemType[]
  team!: ProjectTeamType
  default_step_data: StepDataType = {
    deadline: "2-21-2020",
    description:
      "这是一段很长很长很长的描述性文字。这是一段很长很长很长的描述性文字。"
  }
  // TODO: 不赋值初值，属性就无法响应！！！
  steps_objs: StepsObjType[] = []

  id_random(): number {
    return Math.floor(Math.random() * 10e4)
  }
  default_steps_obj(): StepsObjType {
    let id = this.id_random()
    return {
      plan_name: `计划${id}`,
      power: false,
      steps_data: Array(4).fill(this.default_step_data),
      activeNum: 2,
      id
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
    this.power = true
    this.project_name = "大二房价将藕带"
    this.content_items = [
      {
        title: "项目简介",
        content: [
          "如题目所示，有一个数组 使用 v-for 循环遍历这个数组，进行渲染展示，当用户点击删除按钮的时候应对应的删除 相应的数组元素并且更新 dom",
          "的Joe我都是摸底哦欸哦莫i恶魔"
        ]
      },
      {
        title: "技术栈",
        content: ["Vue", "Vue-router"]
      }
    ]
    this.team = {
      team_name: "的Jodi哦",
      members: [
        {
          portrait: require("@/assets/images/header_avator.gif"),
          introduce: [
            "江小白",
            "2017级",
            "Web前端攻城狮",
            "熟悉Vue全家桶",
            "熟悉SCSS"
          ],
          contribution: [
            "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
            "打法的非法，阿飞，啊额，嗯阿发发的，大非法"
          ]
        },
        {
          portrait: require("@/assets/images/header_avator.gif"),
          introduce: [
            "江小白",
            "2017级",
            "Web前端攻城狮",
            "熟悉Vue全家桶",
            "熟悉SCSS"
          ],
          contribution: [
            "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
            "打法的非法，阿飞，啊额，嗯阿发发的，大非法"
          ]
        },
        {
          portrait: require("@/assets/images/header_avator.gif"),
          introduce: [
            "江小白",
            "2017级",
            "Web前端攻城狮",
            "熟悉Vue全家桶",
            "熟悉SCSS"
          ],
          contribution: [
            "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
            "打法的非法，阿飞，啊额，嗯阿发发的，大非法"
          ]
        }
      ]
    }
    this.steps_objs = [
      {
        plan_name: "前端",
        power: false,
        steps_data: Array(4).fill(this.default_step_data),
        activeNum: 2,
        id: this.id_random()
      },
      {
        plan_name: "后端",
        power: true,
        steps_data: Array(5).fill(this.default_step_data),
        activeNum: 3,
        id: this.id_random()
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import "./CompetitionContent.scss";
</style>
