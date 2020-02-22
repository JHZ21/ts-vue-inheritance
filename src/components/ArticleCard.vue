<template>
  <!-- <div class="article_card" @click="openContentTab(cardData.id)"> -->
  <div class="article_card">
    <div class="article_card_img" :style="{ backgroundImage: cardData.img_url }"></div>
    <div class="article_card_content">
      <span class="article_card_title">{{ cardData.title }}</span>
    </div>
    <div class="article_card_info">
      <span class="reading_volume">
        <i class="iconfont icon-ren"></i>
        {{ cardData.readVolume }}
      </span>
      <div class="card_info_wrapper">
        <span class="card_info_uploader">{{ cardData.uploader }}</span>
        <span class="class_info_date">{{ goodDate }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import { CardData } from "@/utils/interface.ts"
import { timeStampToTargetFormat } from "@/utils/func"

@Component({
  name: "ArticleCard"
})
export default class extends Vue {
  @Prop() cardData!: CardData
  get goodDate(): string {
    return timeStampToTargetFormat(this.cardData.timeStamp)
  }
}
</script>

<style lang="scss" scoped>
$card_width: 220px;
$card_height: $card_width * 1;
$card_border_radius: 6px;
.article_card {
  position: relative;
  width: $card_width;
  height: $card_height;
  border-radius: $card_border_radius;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  @include hover-shadow();
  .article_card_img {
    height: $card_width * 0.618;
    background-size: cover;
    background-position: center center;
    border-top-left-radius: $card_border_radius;
    border-top-right-radius: $card_border_radius;
  }
  .article_card_content {
    .article_card_title {
      text-align: center;
      font-size: 16px;
      line-height: 18px;
      height: 36px;
      font-weight: 500;
      padding: 15px 0 0;
      margin: 0 10px;
      // 多行超出显示省略号
      overflow: hidden;
      word-break: break-word;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .article_card_info {
    position: absolute;
    width: 100%;
    bottom: 0;
    border-bottom-left-radius: $card_border_radius;
    border-bottom-right-radius: $card_border_radius;
    font-size: 12px;
    color: #93999f;
    text-align: center;
    box-sizing: border-box;
    padding: 0 10px 2px;
    .reading_volume {
      height: 24px;
      float: left;
      line-height: 24px;
      font-weight: 400;
    }
    .card_info_wrapper {
      float: right;
      height: 24px;
      line-height: 24px;
      .card_info_uploader {
        padding-right: 10px;
      }
      // .class_info_date {
      // }
    }
  }
}
</style>
