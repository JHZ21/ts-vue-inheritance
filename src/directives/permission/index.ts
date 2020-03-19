import { DirectiveOptions } from "vue"
import { UserModule } from "@/store/modules/user"
import { hasPermission } from "@/utils/func"

// TODO：被删除的el，不能响应添加
export const permission: DirectiveOptions = {
  inserted(el, binding) {
    const { value } = binding
    if (value && value instanceof Array && value.length > 0) {
      if (!hasPermission(value, UserModule.roles)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      el.parentNode && el.parentNode.removeChild(el)
      throw new Error(`need roles! Like v-permission="['admin', 'editor']"`)
    }
  }
}
