<template>
  <div class="add-card-box">
    <el-button circle
      size="small"
      class="add-btn"
      type="primary"
      icon="el-icon-circle-plus-outline"
      @click="open_dialog()"></el-button>
    <el-dialog :title="title"
      class="dialog"
      :modal-append-to-body="false"
      :visible.sync="form.dialogFormVisible">
      <slot></slot>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary"
          @click="confirm()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { deep_copy, props_not_empty } from "@/utils/func"

@Component({
  name: "AddCard"
})
export default class extends Vue {
  @Prop() title!: string
  @Prop() prop_form!: any
  // form: any = {
  //   img: null,
  //   dialogFormVisible: false
  //   ....?
  // }
  form: any = this.prop_form
  save_img(file: any) {
    // 将上传图片储存
    let file_name = (file.name as string).split(".")
    let file_type: string = file_name[file_name.length - 1]
    let reg_img: RegExp = /^(jp|pn)g$/ // jpg , png
    if (file_type && reg_img.test(file_type)) {
      this.form.img = file
    } else {
      console.log("error upload img", file)
      return false
    }
  }
  open_dialog() {
    this.form.dialogFormVisible = true
  }
  cancel() {
    this.form.dialogFormVisible = false
  }
  confirm() {
    console.log("confirm_dialog")
    let form: any = this.form
    if (form && props_not_empty(form)) {
      this.$emit("upload_form_data")
    } else {
      console.log(" 数据错误")
    }
  }
}
</script>

<style lang='scss' scoped>
.add-card-box {
  margin: 10px 0;
  .dialog /deep/ .el-dialog {
    min-width: 400px;
  }
}
</style>