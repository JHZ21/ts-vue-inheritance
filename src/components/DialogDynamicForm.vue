<template>
  <aside class="section-submit-form">
    <el-button type="text"
      @click="openDialog()">修改项目内容</el-button>
    <el-dialog title="修改项目内容"
      v-bind="$attrs"
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
          <el-button @click="addItem()">新增内容块</el-button>
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
  // 使用 $attrs 实现外组件与孙组件通信 visible，model，label-width
  // TODO: 文本还可以 prop 导入，优化

  @Emit("update:visible")
  emitVisible(val: boolean) {}

  @Emit()
  openDialog() {
    this.emitVisible(true)
  }

  @Emit()
  addItem() {}

  @Emit()
  submitForm() {}
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