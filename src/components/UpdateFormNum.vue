<template>
  <el-form-item class="form-num"
    :label="label"
    :label-width="formLabelWidth">
    <el-input type="number"
      :min="minNum"
      max="20"
      step="1"
      v-model="formNum"
      :autofocus="true"
      autocomplete="off"></el-input>
    <el-button @click="updateFormNum">确认</el-button>
  </el-form-item>
</template>

<script lang='ts'>
import { Vue, Component, Emit, Prop } from "vue-property-decorator"

@Component({
  name: "UpdateFormNum"
})
export default class extends Vue {
  @Prop({ required: true }) label!: string
  @Prop({ required: false, default: "120px" }) formLabelWidth!: string
  @Prop({ required: false, default: 1 }) minNum!: number
  @Prop({ required: true }) num!: number

  formNum: number = this.num

  @Emit()
  updateFormNum() {
    return +this.formNum
  }
  init() {
    this.formNum = this.num
  }
}
</script>

<style lang='scss' scoped>
.form-num {
  padding-bottom: 15px;
  border-bottom: $thin-broder;
  & /deep/ .el-form-item__content {
    display: flex;
  }
}
</style>