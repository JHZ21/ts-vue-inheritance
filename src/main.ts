import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { injectLink } from "./utils";
import { Pagination } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/mock/index";
import "@/utils/func";

Vue.use(Pagination);

const ali_font_css = "http://at.alicdn.com/t/font_1610918_mtshjeltqck.css";
injectLink(ali_font_css);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
