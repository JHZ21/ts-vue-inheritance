import { Vue, Component, Watch } from "vue-property-decorator"
import { deep_copy, props_not_empty } from "@/utils/func"

@Component
export class AddCardMixin extends Vue {
  default_form_data: any = {}
  form: any
  @Watch("form.dialogFormVisible")
  onDialogFormVisible(visible: boolean) {
    if (!visible) {
      this.init_form_data()
    }
  }
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
  init_form_data() {
    // 保持与组件内的form 同源
    Object.keys(this.default_form_data).forEach(key => {
      ;(this.form as any)[key] = (this.default_form_data as any)[key]
    })
    let img: any = this.$refs.upload
    img && img.clearFiles()
  }
  //
  // dialogFormVisible: boolean = false
  // default_form_data: any = {
  //   img: null
  // }
  // form: any = {
  //   img: null
  // }
  // // dialog关闭时，清除上传列表
  // @Watch("dialogFormVisible")
  // onDialogFormVisible(visible: boolean) {
  //   if (!visible) {
  //     this.clear_input_img()
  //     this.init_form_data()
  //   }
  // }
  // save_img(file: any) {
  //   // 将上传图片储存
  //   let file_name = (file.name as string).split(".")
  //   let file_type: string = file_name[file_name.length - 1]
  //   let reg_img: RegExp = /^(jp|pn)g$/ // jpg , png
  //   if (file_type && reg_img.test(file_type)) {
  //     this.form.img = file
  //   } else {
  //     console.log("error upload img", file)
  //     return false
  //   }
  // }
  // upload_form_data() {}
  // init_form_data() {
  //   this.form = deep_copy(this.default_form_data)
  // }
  // clear_input_img() {
  //   let img: any = this.$refs.upload
  //   img && img.clearFiles()
  // }
  // open_dialog() {
  //   this.dialogFormVisible = true
  // }
  // cancel() {
  //   this.dialogFormVisible = false
  // }
  // confirm() {
  //   console.log("confirm_dialog")
  //   let form: any = this.form
  //   if (form && props_not_empty(form)) {
  //     this.upload_form_data()
  //   } else {
  //     console.log(" 数据错误")
  //   }
  // }
}
