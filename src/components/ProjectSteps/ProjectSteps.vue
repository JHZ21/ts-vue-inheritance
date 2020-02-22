<template>
  <div class="project-steps-box">
    <div class="plan-name">{{plan_name}}</div>
    <el-steps class="project-steps-wrapper"
      :active="activeNum"
      space="185px"
      process-status="process"
      finish-status="finish">
      <el-step class="project-step"
        v-for="(step, key) in steps_data"
        :title="step.deadline"
        :description="description_template(step.description)"
        :key="key"></el-step>
      <el-button class="code-download"
        icon="el-icon-download"
        @click="download_code"
        circle></el-button>
    </el-steps>

    <div class="set-project-steps"
      v-if="steps_obj.power">
      <div class="set-btns">
        <el-button class="code-upload"
          @click="upload_code"
          icon="el-icon-upload"
          circle></el-button>
        <el-button @click="prev_step">上一阶段</el-button>
        <el-button @click="next_step">下一阶段</el-button>
        <el-button type="text"
          @click="open_dialog_form">制定阶段规划</el-button>
      </div>
      <el-dialog title="规划表"
        :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item class="form-plan-name"
            label="规划名称"
            :label-width="formLabelWidth">
            <el-input type="text"
              v-model="form.plan_name"
              autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="form-step-num"
            label="规划阶段数目"
            :label-width="formLabelWidth">
            <el-input type="number"
              min="1"
              max="20"
              step="1"
              v-model="form.step_num"
              :autofocus="true"
              autocomplete="off"></el-input>
            <el-button @click="make_from_step_tables">确认</el-button>
          </el-form-item>
          <div class="step-tables-wrapper"
            ref="step-tables">
            <div class="step-table-item"
              v-for="(step_table, key) in form.step_tables"
              :key="key">
              <el-form-item label="阶段目标"
                :label-width="formLabelWidth">
                <el-input v-model="step_table.target"
                  autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="阶段截止日期"
                :label-width="formLabelWidth">
                <div class="block">
                  <el-date-picker v-model="step_table.deadline"
                    type="date"
                    placeholder="选择日期"></el-date-picker>
                </div>
              </el-form-item>
              <el-button class="delete-btn"
                v-if="form.step_tables.length >= 2"
                type="danger"
                icon="el-icon-delete"
                @click="delete_step_table(key)"
                circle></el-button>
            </div>
          </div>
        </el-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="close_dialog_form">取 消</el-button>
          <el-button type="primary"
            @click="form_confirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { StepDataType, StepsDataType, StepsObjType } from "@/utils/interface"

enum StepStatus {
  wait,
  process,
  finish,
  error,
  success
}

interface StepTableType {
  target: string
  deadline: string
}
type StepTablesType = StepTableType[]

interface StepsFromType {
  plan_name: string
  step_num: number
  step_tables: StepTablesType
}

@Component({
  name: "ProjectSteps"
})
// TODO: 还有很多逻辑需完善，晚安！
export default class extends Vue {
  @Prop({ required: false, default: { power: false } }) steps_obj!: StepsObjType
  plan_name: string = ""
  steps_data: StepsDataType = []
  activeNum: number = 2
  dialogFormVisible: boolean = false
  form: StepsFromType = {
    plan_name: "",
    step_num: 4,
    step_tables: []
  }
  formLabelWidth: string = "120px"
  download_code() {
    confirm("下载代码成功!")
  }
  upload_code() {
    confirm("上传代码成功!")
  }
  format_date(deadline: string): string {
    const dateObj = new Date(deadline)
    return `${dateObj.getMonth() +
      1}-${dateObj.getDate()}-${dateObj.getFullYear()}`
  }
  delete_step_table(key: number) {
    this.form.step_tables.splice(key, key + 1)
    this.form.step_num--
  }
  open_dialog_form() {
    this.form.plan_name = this.plan_name
    this.form.step_num = this.steps_data.length
    this.dialogFormVisible = true
    this.init_form_step_tables()
  }
  close_dialog_form() {
    this.dialogFormVisible = false
  }
  prev_step() {
    if (this.activeNum > 0) {
      this.activeNum--
    }
  }
  next_step() {
    if (this.activeNum < this.steps_data.length) {
      this.activeNum++
    }
  }
  init_form_step_tables() {
    this.form.step_tables = this.adapter_form_step_tables(this.steps_data)
  }
  adapter_form_step_tables(steps_data: StepsDataType): StepTablesType {
    return steps_data.map(step_data => ({
      deadline: step_data.deadline,
      target: step_data.description
    }))
  }
  adapter_steps_date(step_tables: StepTablesType): StepsDataType {
    const format_date: Function = this.format_date
    return step_tables.map(table => ({
      deadline: format_date(table.deadline),
      description: table.target
    }))
  }
  form_confirm() {
    // TODO: 验证无空value
    this.plan_name = this.form.plan_name
    this.steps_data = this.adapter_steps_date(this.form.step_tables)
    if (this.activeNum > this.steps_data.length) {
      this.activeNum = this.steps_data.length
    }
    this.close_dialog_form()
  }
  make_from_step_tables() {
    this.init_form_step_tables()
    const curr_num: number = this.form.step_tables.length
    const target_num: number = this.form.step_num
    let n: number = target_num - curr_num
    const step_tables: any[] = this.form.step_tables
    if (n > 0) {
      // 添加
      while (n--) {
        let time = Date()
        step_tables.push({
          target: "目标",
          deadline: time
        })
      }
    } else if (n < 0) {
      // 去除
      while (n++) {
        step_tables.pop()
      }
    }
  }
  description_template(description: string) {
    return `${description}`
  }

  created() {
    this.steps_data = this.steps_obj.steps_data
    this.activeNum = this.steps_obj.activeNum
    this.plan_name = this.steps_obj.plan_name
  }
}
</script>

<style lang="scss" scoped>
@import "./ProjectSteps.scss";
</style>
