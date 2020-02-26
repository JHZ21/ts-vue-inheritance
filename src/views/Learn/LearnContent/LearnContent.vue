<template>
  <div class="learn-content">
    <div class="learn-content-article">
      <iframe class="content-page"
        :src="contentUrl"></iframe>
    </div>
    <div class="learn-content-comments">
      <div class="comments-wrapper">
        <comment-box class="comment-box"
          v-for="(comment, key) in comment_infos"
          :commentInfo="comment"
          :key="key"></comment-box>
      </div>
      <div class="send-comment">
        <textarea ref="sendTextarea"
          class="send-textarea"
          name=""
          id=""
          rows="6"
          v-model="myCommentText"
          placeholder="畅所欲言..."
          @focus="sendTextareaFocus()"
          @blur="sendTextareaBlur()"
          @keyup.ctrl.enter.exact="sendComment(true)"></textarea>
        <div class="send-button-wrapper"
          v-show="showSendBtn">
          <span class="send-shortcut-keys-text">Ctrl or ⌘ + Enter</span>
          <button class="send-btn"
            @click="sendComment()"
            :disabled="!myCommentText">
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import { LearnModule, oContentUrlType } from "@/store/modules/learn.ts"
import { CommentInfoType } from "@/utils/interface"
import CommentBox from "@/components/CommentBox.vue"
import { getContent } from "@/api/learn"

@Component({
  name: "LearnContent",
  components: {
    CommentBox
  }
})
export default class extends Vue {
  content_id: string = ""
  contentUrl: string = ""
  myCommentText: string = ""
  showSendBtn: boolean = false
  comment_infos: CommentInfoType[] = []
  sendTextareaFocus() {
    this.showSendBtn = true
  }
  sendTextareaBlur() {
    if (this.myCommentText === "") {
      this.showSendBtn = false
    }
  }
  sendComment(keyup: boolean = false) {
    if (!this.myCommentText) return
    const defaultCommentInfo: CommentInfoType = {
      portraitUrl: require("@/assets/images/header_avator.gif"),
      username: "aadsf",
      content: this.myCommentText,
      timeStamp: new Date().getTime()
    }
    this.comment_infos.unshift(defaultCommentInfo)
    this.myCommentText = ""
    keyup || (this.showSendBtn = false)
  }

  created() {
    this.content_id = this.$route.params.id
    let params: object = {
      content_id: this.content_id
    }
    getContent(params).then(res => {
      let data: any = res.data

      if (data && data.content_url) {
        this.contentUrl = data.content_url
        this.comment_infos = data.comment_infos
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "./LearnContent.scss";
</style>
