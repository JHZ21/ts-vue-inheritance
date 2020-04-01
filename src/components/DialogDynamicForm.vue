<template>
  <aside class="section-submit-form">
    <el-button type="text"
      @click="openDialog()">{{openText}}</el-button>
    <el-dialog v-bind="$attrs"
      v-on="$listeners"
      :modal-append-to-body="false">
      <el-form class="dynamic-form"
        ref="form"
        v-bind="$attrs"
        v-on="$listeners">
        <slot>
        </slot>
        <el-form-item>
          <el-button type="primary"
            @click="submitForm()">提交</el-button>
          <el-button v-if="isAddBtn"
            @click="addItem()">{{addItemText}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </aside>
</template>

<script lang='ts'>
import { Vue, Component, Emit, Watch, Prop } from "vue-property-decorator"

@Component({
  name: "DialogDynamicForm"
})
export default class extends Vue {
  // 使用 $attrs 实现外组件与孙组件通信 visible，model，label-width, title
  @Prop({ required: true }) openText!: string
  @Prop({ required: false, default: "新增" }) addItemText!: string
  @Prop({ required: false, default: true }) isAddBtn!: boolean

  @Emit("update:visible")
  emitVisible(val: boolean) {}

  @Emit()
  openDialog() {
    this.emitVisible(true)
  }

  @Emit()
  addItem() {}

  @Emit()
  submitForm() {
    // 表单有效性验证
    let formValid!: boolean
    ;(this.$refs.form as any).validate((valid: boolean) => {
      formValid = valid
    })
    return formValid
  }
}
</script>

<style lang='scss' scoped>
.dynamic-form {
  /deep/ .el-form-item__content {
    display: flex;
    justify-content: flex-end;
  }
  /deep/ textarea {
    @include webkit-scrollbar();
  }
  .input-from-wrapper {
    @include dynamic-form-wrapper();
  }
  .icon-btn {
    margin-left: 40px;
  }
}
</style>