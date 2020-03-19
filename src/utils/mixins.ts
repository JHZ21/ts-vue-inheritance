import { Vue, Component, Watch } from "vue-property-decorator"
import { UserModule } from "@/store/modules/user"
import { hasPermission } from "@/utils/func"
import * as Forage from "@/utils/localForage"
import { NavRow } from "@/utils/interface"

@Component
export class LearnCompetMixin extends Vue {
  async updateNavData(getNavData: Function, localKey: string) {
    let resData: NavRow[] = []
    const res: any = await getNavData()
    if (res.data && res.data.navData) {
      console.log(localKey, "get network")
      Forage.setLocalForage(localKey, res.data.navData)
      resData = res.data.navData
    }
    return resData
  }
  async getNavData(getNavData: Function, localKey: string) {
    let resData: NavRow[] = []
    // 有效期24h
    await Forage.getVailLocalForage(localKey, 24 * 60)
      .then(async navData => {
        if (navData) {
          console.log(localKey, "get localForage")
          resData = navData as NavRow[]
        } else {
          resData = await this.updateNavData(getNavData, localKey)
        }
      })
      .catch(err => {
        console.log(err)
      })
    return resData
  }
}

@Component
export class CommonMixin extends Vue {
  get isLogin(): boolean {
    return UserModule.isLogin
  }

  hasPermission(value: string[]): boolean {
    return hasPermission(value, UserModule.roles)
  }
}

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
    let reg_img: RegExp = /^(jp|jpe|pn)g$/ // jpg, jpeg , png
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
}
