<template>
  <div class="comment-box">
    <div class="head-portrait-wrapper">
      <div
        class="head-portrait"
        :style="{ backgroundImage: `url(${commentInfo.portraitUrl})` }"
      ></div>
    </div>
    <div class="content-box">
      <div class="meta-box">
        <span class="username">{{ commentInfo.username }}</span>
      </div>
      <div class="content" :title="commentInfo.content">
        {{ commentInfo.content }}
      </div>
      <div class="reply-stat">
        <time class="time" data-time="" title="">{{
          goodDate(commentInfo.timeStamp)
        }}</time>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CommentInfoType } from "@/utils/interface";
import { timeStampToTargetFormat } from "@/utils/func";

@Component({
  name: "CommentBox"
})
export default class extends Vue {
  @Prop({ required: true }) commentInfo!: CommentInfoType;

  goodDate(timeStamp: number): string {
    let result_str: string = "";
    if (!timeStamp) return result_str;
    const DateTarget: Date = new Date(timeStamp);
    const DateNow: Date = new Date();
    if (
      DateTarget.getFullYear() !== DateNow.getFullYear() ||
      DateTarget.getMonth() !== DateNow.getMonth()
    ) {
      result_str = timeStampToTargetFormat(timeStamp);
    } else {
      const diff_day = DateNow.getDay() - DateTarget.getDay();
      result_str = diff_day === 0 ? "今天" : `${diff_day}天前`;
    }
    return result_str;
  }
}
</script>

<style lang="scss" scoped>
.comment-box {
  display: flex;
  .head-portrait-wrapper {
    flex: 0 0 33px;
    .head-portrait {
      width: 33px;
      height: 33px;
      border-radius: 50%;
      background-position: center;
      background-size: 100% 100%;
    }
  }
  .content-box {
    flex: 1 1 auto;
    margin: 0 5px 0 10px;
    border-bottom: 1px solid #dce7f1;
    .meta-box {
      text-align: left;
      .username {
        color: #333;
        font-weight: 400;
      }
    }
    .content {
      text-align: left;
      margin-top: 5px;
      color: #505050;
      @include ellipsisN(3);
    }
    .reply-stat {
      margin: 10px 0;
      text-align: right;
      .time {
        margin-left: auto;
        color: #8a9aa9;
        font-size: 14px;
        cursor: default;
      }
    }
  }
}
</style>
