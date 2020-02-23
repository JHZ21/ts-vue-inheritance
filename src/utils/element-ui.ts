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
  DatePicker,
  Row
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
  DatePicker,
  Row
]

aComponets.forEach(compent => {
  Vue.use(compent)
})
