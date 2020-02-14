<template>
  <div class="learn-content">
    <div class="learn-content-article">
      <iframe class="content-page" :src="contentUrl"></iframe>
    </div>
    <div class="learn-content-comments">
      <div class="comments-wrapper">
        <comment-box
          class="comment-box"
          v-for="(comment, key) in aCommentInfos"
          :commentInfo="comment"
          :key="key"
        ></comment-box>
      </div>
      <div class="send-comment">
        <textarea
          ref="sendTextarea"
          class="send-textarea"
          name=""
          id=""
          rows="6"
          v-model="myCommentText"
          placeholder="畅所欲言..."
          @focus="sendTextareaFocus()"
          @blur="sendTextareaBlur()"
          @keyup.ctrl.enter.exact="sendComment(true)"
        ></textarea>
        <div class="send-button-wrapper" v-show="showSendBtn">
          <span class="send-shortcut-keys-text">Ctrl or ⌘ + Enter</span>
          <button
            class="send-btn"
            @click="sendComment()"
            :disabled="!myCommentText"
          >
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
import { getOCententUrl } from "@/api/learn"

@Component({
  name: "LearnContent",
  components: {
    CommentBox
  }
})
export default class extends Vue {
  contentUrl: string = ""
  myCommentText: string = ""
  showSendBtn: boolean = false
  aCommentInfos: CommentInfoType[] = [
    {
      portraitUrl: require("@/assets/images/header_avator.gif"),
      username: "aadsf",
      content:
        "新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~",
      timeStamp: 1580479254959
    },
    {
      portraitUrl: require("@/assets/images/header_avator.gif"),
      username: "aadsf",
      content:
        "新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~",
      timeStamp: 1580313600000
    },
    {
      portraitUrl: require("@/assets/images/header_avator.gif"),
      username: "aadsf",
      content:
        "新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~",
      timeStamp: 1577635200000
    },
    {
      portraitUrl: require("@/assets/images/header_avator.gif"),
      username: "aadsf",
      content:
        "新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~",
      timeStamp: 1500479154959
    }
  ]
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
    this.aCommentInfos.unshift(defaultCommentInfo)
    this.myCommentText = ""
    keyup || (this.showSendBtn = false)
  }

  created() {
    getOCententUrl().then(res => {
      LearnModule.SetOContentUrl(res.data)
      const oContentUrl: oContentUrlType = LearnModule.oContentUrl
      this.contentUrl = oContentUrl[this.$route.params.id]
    })
  }
}
</script>

<style lang="scss" scoped>
.learn-content {
  position: absolute;
  display: flex;
  width: 100%;
  height: calc(100% - 44px);
  .learn-content-article {
    position: relative;
    height: 100%;
    display: flex;
    flex: 80%;
    .content-page {
      position: relative;
      height: 100%;
      width: 100%;
    }
  }
  .learn-content-comments {
    position: relative;
    height: 100%;
    display: flex;
    flex: auto;
    max-width: 300px;
    min-width: 100px;
    flex-direction: column;
    .comments-wrapper {
      flex: 1 1 auto;
      padding: 10px 0 50px;
      overflow-y: auto;
      .comment-box {
        margin-bottom: 10px;
      }
    }
    .send-comment {
      flex: 0 1 auto;
      position: relative;
      width: 100%;
      bottom: 0;
      .send-textarea {
        width: 100%;
        height: 100%;
        font-size: 16px;
        box-sizing: border-box;
      }
      .send-button-wrapper {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        top: -40px;
        right: 0;
        height: 40px;
        padding: 0 5px;
        margin-right: 17px;
        background-color: #f2f2f2;
        border-top-left-radius: 10px;
        .send-shortcut-keys-text {
          color: #c2bdbd;
          font-size: 13px;
          margin: 0 5px;
        }
        .send-btn {
          padding: 5px 10px;
          background-color: #027fff;
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          font-size: 16px;
          color: #fff;
          outline: none;
          margin-left: 5px;
          border: 0;
          &:disabled {
            background-color: #597fac;
          }
        }
      }
    }
  }
}
</style>
