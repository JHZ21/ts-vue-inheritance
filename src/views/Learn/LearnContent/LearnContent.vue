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
import { getContent, getOContentUrl } from "@/api/learn"
import {
  getLocalForage,
  getVailLocalForage,
  setLocalForage
} from "../../../utils/localForage"

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
  get_obj_content_url(): Promise<unknown> {
    // 先查看localForage 数据是否可用，不可用则发起请求
    const articleKey: string = `articel_${this.content_id}`
    return getVailLocalForage(articleKey, 24 * 60).then(data => {
      if (data && (data as { url: string }).url) {
        console.log("getVailLocalForage", articleKey)
        this.contentUrl = articleKey
        // if (!LearnModule.oContentUrl) {
        //   LearnModule.SetOContentUrl(data as oContentUrlType)
        // }
        // return data
      } else {
        // 不存在或者无效, 则再次请求
        // return promise, 将等待其状态变化
        // return getOContentUrl().then(res => {
        //   setLocalForage(articleKey, res.data)
        //   LearnModule.SetOContentUrl(res.data)
        //   return res.data
        // })
      }
    })
  }
  get_content_url() {
    this.get_obj_content_url().then(data => {
      let contentUrl: string | undefined
      if ((contentUrl = (data as oContentUrlType)[this.content_id])) {
        this.contentUrl = contentUrl
      }
    })
  }
  get_content_data() {
    let oContentUrl: oContentUrlType | null = LearnModule.oContentUrl

    if (oContentUrl && oContentUrl[this.content_id]) {
      // Vuex 存在对应 contentUrl
      this.contentUrl = oContentUrl[this.content_id]
    } else {
      // 发起请求
      this.get_content_url()
    }
    let params: object = {
      content_id: this.content_id
    }
    getContent(params).then(res => {
      let data: any = res.data
      if (data && data.comment_infos) {
        // this.contentUrl = data.content_url
        this.comment_infos = data.comment_infos
      }
    })
  }
  getArticelUrl() {
    const articleKey: string = `article_${this.content_id}`
    return getVailLocalForage(articleKey, 24 * 60).then(data => {
      if (data && (data as { url: string }).url) {
        console.log("getVailLocalForage", articleKey)
        this.contentUrl = (data as { url: string }).url
      } else {
        console.log("ocalForage is invalid", data)
        // 不存在或者无效, 则再次请求
      }
    })
  }
  created() {
    this.content_id = this.$route.params.id
    this.getArticelUrl()

    // this.get_content_data()
  }
}
</script>

<style lang="scss" scoped>
@import "./LearnContent.scss";
</style>
