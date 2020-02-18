<template>
  <div>
    <el-steps
      class="project-steps"
      align-center
      :active="activeNum"
      space="200px"
      :process-status="processStatus"
      :finish-status="finishStatus"
    >
      <el-step
        class="project-step"
        v-for="(step, key) in steps_data"
        :title="step.title"
        :description="descriptionTemplate(step.deadline, step.description)"
        :key="key"
      ></el-step>
    </el-steps>
    <el-button style="margin-top: 12px;" @click="next_step">下一阶段</el-button>
    <el-button type="text" @click="dialogFormVisible = true"
      >制定阶段规划</el-button
    >

    <el-dialog title="规划表" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="规划阶段数目" :label-width="formLabelWidth">
          <el-input
            type="number"
            min="1"
            max="20"
            step="1"
            v-model="form.stepNum"
            autocomplete="off"
          ></el-input>
          <el-button @click="make_from_step_tables">确认</el-button>
        </el-form-item>

        <div
          class="step-table-item"
          v-for="(step_table, key) in form.step_tables"
          :key="key"
        >
          <el-form-item label="阶段目标" :label-width="formLabelWidth">
            <el-input v-model="step_table.target" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="阶段截止日期" :label-width="formLabelWidth">
            <div class="block">
              <el-date-picker
                v-model="step_table.deadline"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="form_confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"

enum StepStatus {
  wait,
  process,
  finish,
  error,
  success
}

interface StepDataType {
  title: string
  deadline: string
  description: string
}

type StepsDataType = StepDataType[]

@Component({
  name: "ProjectSteps"
})
// TODO: 还有很多逻辑需完善，晚安！
export default class extends Vue {
  @Prop({ required: false }) steps_data: StepsDataType = []
  finishStatus: string = StepStatus[2] // finish
  processStatus: string = StepStatus[1] // process
  stepNum: number = 4
  activeNum: number = 2
  dialogFormVisible: boolean = false
  form = {
    stepNum: 4,
    target: "",
    time_range: "",
    step_tables: []
  }
  formLabelWidth: string = "120px"

  next_step() {
    if (this.activeNum < this.steps_data.length) {
      this.activeNum++
      if (this.activeNum === this.steps_data.length) {
        confirm("恭喜完成规划！")
        // TODO： 规划更新，还需还原
        this.finishStatus = StepStatus[4] // success
      }
    }
  }
  adapter_steps_date(step_tables: any[]): StepsDataType {
    return step_tables.map(table => ({
      title: "adaf",
      deadline: table.deadline,
      description: table.target
    }))
  }
  form_confirm() {
    this.steps_data = this.adapter_steps_date(this.form.step_tables)
    this.dialogFormVisible = false
  }
  make_from_step_tables() {
    const curr_num: number = this.form.step_tables.length
    const target_num: number = this.form.stepNum
    let n: number = target_num - curr_num
    const step_tables: any[] = this.form.step_tables
    if (n > 0) {
      // 添加
      while (n--) {
        step_tables.push({
          target: "",
          deadline: ""
        })
      }
    } else if (n < 0) {
      // 去除
      while (n++) {
        step_tables.pop()
      }
    }
  }
  descriptionTemplate(deadline: string, description: string) {
    return `${deadline}
    ${description}`
  }

  created() {
    const step_date: StepDataType = {
      title: "阶段一",
      deadline: "2020/2/21",
      description:
        "这是一段很长很长很长的描述性文字。这是一段很长很长很长的描述性文字。"
    }
    this.steps_data = Array(this.stepNum).fill(step_date)
  }
}
</script>

<style lang="scss" scoped>
@import "./ProjectSteps.scss";
</style>
