import Vue from "vue"
import "element-ui/lib/theme-chalk/index.css"
import {
  Pagination,
  Steps,
  Step,
  Dialog,
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker
} from "element-ui"

const aComponets: any[] = [
  Pagination,
  Steps,
  Step,
  Dialog,
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker
]

aComponets.forEach(compent => {
  Vue.use(compent)
})

// Vue.use(Pagination)
// Vue.use(Steps)
// Vue.use(Step)
// Vue.use(Dialog)
// Vue.use(Button)
