import Vue, { DirectiveOptions } from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import router from "./router"
import store from "./store"
import { injectLink } from "./utils/func"
import "@/utils/element-ui"
// import "@/mock/index"
import "@/utils/func"
import "@/permission"
import * as directives from "@/directives"

const ali_font_css = "https://at.alicdn.com/t/font_1610918_mtshjeltqck.css"
injectLink(ali_font_css)

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
