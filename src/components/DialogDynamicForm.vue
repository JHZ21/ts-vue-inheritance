<template>
  <aside class="section-submit-form">
    <el-button type="text"
      @click="openDialog()">修改项目内容</el-button>
    <el-dialog title="修改项目内容"
      :modal-append-to-body="false">
      <el-form ref="form"
        class="dynamic-form">
        <!-- <div class="input-from-wrapper">
          <div v-for="(item, index) in contentForms.contents"
            :key="item.time|| index">
            <el-form-item :label="'内容块' + (index+1)"
              :prop="`contents[${index}].title`"
              :rules="{
                  required:true, message: '内容名不能为空', trigger: 'blur'
                  }">
              <el-input v-model="item.title"
                :readonly="index === 0"
                placeholder="小标题"></el-input>
              <el-button type="danger"
                circle
                class="icon-btn"
                v-if="index !==0"
                icon="el-icon-delete"
                @click.prevent="contentRemoveItem(item)"></el-button>
            </el-form-item>
            <el-form-item :prop="`contents[${index}].content`"
              :rules="{
                  required: true, message: '内容不能为空', trigger: 'blur'
                 }">
              <el-input type="textarea"
                :rows="3"
                v-model="item.content"
                placeholder="快输入点什么东西吧">
              </el-input>
            </el-form-item>
          </div>
        </div> -->
        <el-form-item>
          <el-button type="primary"
            @click="submitForm()">提交</el-button>
          <el-button @click="addItem()">新增内容块</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </aside>
</template>

<script lang='ts'>
import { Vue, Component, Emit, Watch, Prop } from "vue-property-decorator"

@Component({
  name: "DialogDynamicForm"
})
export default class extends Vue {
  // 使用 $attrs 实现外组件与孙组件通信 visible，model，label-width

  @Emit("udpate:visible")
  openDialog() {}

  @Emit("udpate:visible")
  closeDialog() {
    return false
  }
  @Emit()
  formUpdate() {}
  @Emit()
  addItem() {}

  @Emit()
  submitForm() {
    return this.$refs["form"]
    // ;(this.$refs[formName] as any).validate((valid: boolean) => {
    //   if (valid) {
    //     this.formUpdate()
    //     alert("submit!")
    //   } else {
    //     console.log("error submit!!")
    //     // return false
    //   }
    // })
  }
}
</script>

<style lang='scss' scoped>
</style>