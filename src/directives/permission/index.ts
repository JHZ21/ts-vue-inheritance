import { DirectiveOptions } from "vue"
import { UserModule } from "@/store/modules/user"

export const permission: DirectiveOptions = {
  inserted(el, binding) {
    const { value } = binding
    const roles: string[] = UserModule.roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles: string[] = value
      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin', 'editor']"`)
    }
  }
}
