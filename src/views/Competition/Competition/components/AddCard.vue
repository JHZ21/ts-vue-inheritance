<template>
  <div class="add-card-box">
    <el-button circle
      size="small"
      class="add-btn"
      type="primary"
      icon="el-icon-circle-plus-outline"
      @click="open_dialog()"></el-button>
    <el-dialog :title="title"
      class="dialog"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item>
          <el-input v-model="form.article_url"
            autocomplete="off">
            <template slot="prepend">链接</template></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.title"
            autocomplete="off"><template slot="prepend">介绍</template></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload class="upload-demo"
            drag
            list-type="picture"
            :auto-upload="true"
            name="img"
            ref="upload"
            :before-upload="save_img"
            :http-request="()=>{}"
            :limit="1"
            action="xx">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip"
              slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary"
          @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import axios from "axios"
import { AddCardMixin } from "@/utils/mixins"

@Component({
  name: "AddCard",
  mixins: [AddCardMixin]
})
export default class extends Vue {
  @Prop({ required: false }) title!: string
}
</script>

<style lang='scss' scoped>
.add-card-box {
  margin: 10px 0;
  .dialog /deep/ .el-dialog {
    min-width: 400px;
  }
}
</style>