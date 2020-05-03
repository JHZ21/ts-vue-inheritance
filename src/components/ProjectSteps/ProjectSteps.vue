<template>
  <div class="project-steps-box">
    <div class="plan-name">{{plan_name}}</div>
    <el-steps class="project-steps-wrapper"
      :active="activeNum"
      space="185px"
      process-status="process"
      finish-status="finish">
      <el-step class="project-step"
        :class="{'i-width': i_width(key)}"
        v-for="(step, key) in steps_data"
        :title="step.deadline"
        :description="description_template(step.description)"
        :key="key"></el-step>
    </el-steps>
    <el-button class="code-download"
      icon="el-icon-download"
      @click="download_code"
      circle></el-button>
    <a style="{display: none}"
      :href="codeUrl"
      ref="downloadCode"></a>
    <div class="set-project-steps-wrapper">
      <div v-if="isPermission">
        <div class="set-btns">
          <el-button class="code-upload"
            @click="upload_code"
            icon="el-icon-upload"
            circle></el-button>
          <el-dialog title="项目代码"
            :visible.sync="codeDialog.dialogVisible">
            <el-form ref="urlForm"
              :model="codeDialog.urlForm">
              <el-form-item label="项目下载地址"
                prop="codeUrl"
                :rules="{
                  required: true, message: '下载地址不能为空', trigger: 'blur'
                }">
                <el-input v-model="codeDialog.urlForm.codeUrl"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                  @click="confirmCodeUrl">确认</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-button @click="prev_step">上一阶段</el-button>
          <el-button @click="next_step">下一阶段</el-button>
          <dialog-dynamic-form class="open-steps-text"
            :visible.sync="dialogFormVisible"
            :model="form"
            :label-width="formLabelWidth"
            title="规划表"
            open-text="制定阶段规划"
            confirm-text="确认"
            add-item-text="新增阶段"
            @open-dialog="open_dialog_form"
            @submit-form="submitForm"
            @add-item="addItem">
            <el-form-item label="规划名称"
              prop="plan_name"
              :rules="{
                required: true, message: '规划名不能空', trigger: 'blur'
              }">
              <el-input v-model="form.plan_name">
              </el-input>
            </el-form-item>
            <div class="input-from-wrapper">
              <div v-for="(item, index) in form.step_tables"
                :key="item.time|| index">
                <el-form-item :label="'阶段' + (index+1)"
                  :prop="`step_tables[${index}].target`"
                  :rules="{
                  required:true, message: '阶段内容不能为空', trigger: 'blur'
                  }">
                  <el-input v-model="item.target"
                    placeholder="写点阶段内容吧..."></el-input>
                  <el-button type="danger"
                    circle
                    class="icon-btn"
                    v-if="index !==0"
                    icon="el-icon-delete"
                    @click.prevent="removeItem(item)"></el-button>
                </el-form-item>
                <el-form-item label="截止日期"
                  :prop="`step_tables[${index}].deadline`"
                  :rules="{
                  required: true, message: '日期不能为空', trigger: 'blur'
                  }">
                  <div class="block">
                    <el-date-picker v-model="item.deadline"
                      type="date"
                      placeholder="选择日期"></el-date-picker>
                  </div>
                </el-form-item>
              </div>
            </div>
          </dialog-dynamic-form>
          <el-button type="primary"
            @click="updateSteps">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator"
import { StepDataType, StepsDataType, StepsObjType } from "@/utils/interface"
import DialogDynamicForm from "@/components/DialogDynamicForm.vue"
import { isUndef, deep_copy } from "@/utils/func"
import { valid } from "mockjs"

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
  time: number
}
type StepTablesType = StepTableType[]

interface StepsFromType {
  plan_name: string
  // step_num: number
  step_tables: StepTablesType
}

@Component({
  name: "ProjectSteps",
  components: {
    DialogDynamicForm
  }
})
// TODO: 还有很多逻辑需完善，晚安！
export default class extends Vue {
  // $listeners submit-form
  @Prop({ required: false }) steps_obj!: StepsObjType
  @Prop({ required: true, default: false }) isPermission!: boolean
  plan_name: string = ""
  steps_data: StepsDataType = []
  activeNum: number = 0
  codeUrl: string =
    "https://codeload.github.com/JHZ21/ts-vue-inheritance/zip/master"
  dialogFormVisible: boolean = false
  form: StepsFromType = {
    plan_name: "",
    step_tables: [
      {
        target: "",
        deadline: "",
        time: 0
      }
    ]
  }
  codeDialog = {
    dialogVisible: false,
    code: "",
    urlForm: {
      codeUrl: ""
    },
    fileForm: {
      codeFile: ""
    }
  }
  formLabelWidth: string = "120px"
  @Watch("steps_obj", { immediate: true, deep: true })
  onStepsObj(stepsObj: StepsObjType) {
    this.updateStepsObj(stepsObj)
    this.initFormStepTables()
  }
  updateStepsObj(stepsObj: StepsObjType) {
    if (isUndef(stepsObj)) return
    this.steps_data = deep_copy(stepsObj.stepsData)
    this.activeNum = stepsObj.activeNum
    this.plan_name = stepsObj.planName
  }

  i_width(key: number): boolean {
    return key < this.activeNum
  }
  download_code() {
    console.log("download_code")
    ;(this.$refs["downloadCode"] as any).click()
    // confirm("下载代码成功!")
    // this.codeDialog.dialogVisible = true
  }

  upload_code() {
    // confirm("上传代码成功!")
    this.codeDialog.dialogVisible = true
    const formCode: any = this.codeDialog.code
    if (!formCode) {
      this.codeDialog.urlForm.codeUrl = this.codeUrl
    } else if (typeof formCode === "string") {
      this.codeDialog.urlForm.codeUrl = formCode
    }
  }
  confirmCodeUrl() {
    ;(this.$refs.urlForm as any).validate((valid: boolean) => {
      if (valid) {
        this.codeDialog.code = this.codeDialog.urlForm.codeUrl
        alert("修改成功")
        this.codeDialog.dialogVisible = false
      } else {
        alert("修改失败")
      }
    })
  }
  format_date(deadline: string): string {
    console.log("deadline: ", deadline)
    const dateObj = new Date(deadline)
    return `${dateObj.getMonth() +
      1}-${dateObj.getDate()}-${dateObj.getFullYear()}`
  }
  open_dialog_form() {
    this.initFormStepTables()
  }
  addItem() {
    this.form.step_tables.push({
      target: "阶段内容",
      deadline: Date(),
      time: +Date.now()
    })
  }
  removeItem(item: StepTableType) {
    const step_tables: StepTableType[] = this.form.step_tables
    let index = step_tables.indexOf(item)
    if (index !== -1) {
      step_tables.splice(index, 1)
    }
  }

  submitForm(valid: boolean) {
    if (!valid) return
    console.log("submitForm")
    this.updateStepsObj(this.newStepsObj())
    this.closeDialog()
  }
  @Emit()
  updateSteps() {
    return this.newStepsObj()
  }

  @Emit("steps_obj")
  emitStepsObj(stepsObj: StepsObjType) {}

  closeDialog() {
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
  initFormStepTables() {
    this.form.plan_name = this.plan_name
    this.form.step_tables = this.adapter_form_step_tables(this.steps_data)
  }
  adapter_form_step_tables(steps_data: StepsDataType): StepTablesType {
    return steps_data.map(step_data => ({
      deadline: step_data.deadline,
      target: step_data.description,
      time: step_data.time || +Date.now()
    }))
  }
  adapter_steps_date(step_tables: StepTablesType): StepsDataType {
    const format_date: Function = this.format_date
    return step_tables.map(table => ({
      deadline: format_date(table.deadline),
      description: table.target,
      time: table.time
    }))
  }
  newStepsObj(): StepsObjType {
    const steps_obj: StepsObjType = deep_copy(this.steps_obj)
    steps_obj.planName = this.form.plan_name
    steps_obj.stepsData = this.adapter_steps_date(this.form.step_tables)
    steps_obj.activeNum =
      this.activeNum > this.steps_data.length
        ? this.steps_data.length
        : this.activeNum
    return steps_obj
  }
  description_template(description: string) {
    return `${description}`
  }
}
</script>

<style lang="scss" scoped>
@import "./ProjectSteps.scss";
</style>
