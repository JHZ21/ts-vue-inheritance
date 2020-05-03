import { Vue, Component, Watch } from "vue-property-decorator"
import { UserModule } from "@/store/modules/user"
import { hasPermission, resSuccess, isDef } from "@/utils/func"
import * as Forage from "@/utils/localForage"
import {
  NavRow,
  CardData,
  UpdateStoreDataType,
  GetDataType
} from "@/utils/interface"

@Component
export class CommonMixin extends Vue {
  // 从后端更新data返回, 并储存本地
  async updateStoreData(
    updateDataApi: Function,
    params: any,
    localKey: string,
    localProp: string
  ) {
    let data: any = null
    const res = await updateDataApi(params)
    if (resSuccess(res)) {
      data = res.data[localProp]
      console.log(localKey, "get network")
      Forage.setLocalForage(localKey, data)
    }
    return data
  }
  // 获取data, 先从本地，在从后端
  async getData(
    updateData: Function,
    params: any,
    localKey: string,
    max_minute?: number
  ) {
    let resData: any = null
    await Forage.getVailLocalForage(localKey, max_minute).then(async data => {
      if (data) {
        console.log(localKey, "get localForage")
        resData = data
      } else {
        // 从后端更新data
        // 分离出去, 不要都一个函数做!!!
        // updateData 需要自己setLocal
        // 参数个数 > 1 且params 为数组
        if (updateData.length > 1 && Array.isArray(params)) {
          resData = await updateData(...params)
        } else {
          resData = await updateData(params)
        }
      }
    })
    return resData
  }
  get isLogin(): boolean {
    return UserModule.isLogin
  }
  hasPermission(value: string[]): boolean {
    return hasPermission(value, UserModule.roles)
  }
}

@Component({
  mixins: [CommonMixin]
})
export class LearnCompetMixin extends Vue {
  updateStoreData!: UpdateStoreDataType
  getData!: GetDataType
  // 从后端更新NavData, 并存本地
  async updateNavData(getNavData: Function, localKey: string) {
    return this.updateStoreData(getNavData, undefined, localKey, "navData")
  }
  // 获取NavData, 并存本地
  async getNavData(getNavData: Function, localKey: string) {
    return this.getData(
      this.updateNavData,
      [getNavData, localKey],
      localKey,
      30
    )
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
