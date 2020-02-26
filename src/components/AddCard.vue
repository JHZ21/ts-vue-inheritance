<template>
  <div class="add-card-box">
    <el-button circle
      size="small"
      class="add-btn"
      type="primary"
      icon="el-icon-circle-plus-outline"
      @click="open_dialog()"></el-button>
    <el-dialog :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible">
      <slot></slot>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary"
          @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator"

@Component({
  name: "AddCard"
})
export default class extends Vue {
  @Prop() title!: string
  dialogFormVisible: boolean = false
  formLabelWidth: string = "120px"
  open_dialog() {
    this.$emit("open_dialog")
    this.dialogFormVisible = true
  }
  cancel() {
    this.$emit("cancel")
    this.dialogFormVisible = false
  }
  confirm() {
    this.$emit("confirm")
    this.dialogFormVisible = false
  }
}
</script>

<style lang='scss' scoped>
.add-card-box {
  margin: 10px 0;
}
</style>