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
import { getLearnContent } from "@/api/learn"
import {
  getLocalForage,
  getVailLocalForage,
  setLocalForage
} from "@/utils/localForage"

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
  getArticelUrl() {
    const articleKey: string = `article-${this.content_id}`
    return getVailLocalForage(articleKey, 24 * 60).then(data => {
      if (data && (data as { articleUrl: string }).articleUrl) {
        console.log("getVailLocalForage", articleKey)
        this.contentUrl = (data as { articleUrl: string }).articleUrl
        this.comment_infos = (data as { comments: any[] }).comments
      } else {
        const params = {
          id: this.content_id
        }
        getLearnContent(params).then(res => {
          if (res && res.data && res.data.code === 200) {
            const data: {
              articleUrl: string
              comments: CommentInfoType[]
            } = res.data.content
            this.contentUrl = data.articleUrl
            this.comment_infos = data.comments
            setLocalForage(articleKey, {
              articleUrl: data.articleUrl,
              comments: data.comments
            })
            console.log("content get newtwork")
          } else {
            console.log(res)
          }
        })
      }
    })
  }
  created() {
    this.content_id = this.$route.params.id
    this.getArticelUrl()
  }
}
</script>

<style lang="scss" scoped>
@import "./LearnContent.scss";
</style>
