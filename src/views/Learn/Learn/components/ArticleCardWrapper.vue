<template>
  <div class="article-wrapper">
    <open-new-tab :url="new_tab_url(cardData.id, cardData.isAllowedFrame, cardData.articleUrl)"
      @opened="readArticle(cardData.id)">
      <article-card class="article_card"
        :cardData="cardData"></article-card>
    </open-new-tab>
    <transition name="slide-down">
      <i v-if="userId && cardData.uploader.userId === userId"
        class="iconfont icon-shibai delete-card"
        @click.stop="deleteArticle(cardData.id)"></i>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit } from "vue-property-decorator"
import OpenNewTab from "@/components/OpenNewTab.vue"
import ArticleCard from "@/components/ArticleCard.vue"
import { LearnModule } from "@/store/modules/learn"
import { CardData, ASelectedType } from "@/utils/interface"
import { resSuccess } from "@/utils/func"
import * as Learn from "@/api/learn"

@Component({
  name: "ArticleCardWrapper",
  components: {
    OpenNewTab,
    ArticleCard
  }
})
export default class extends Vue {
  @Prop({ required: true }) cardData!: CardData
  @Prop({ required: true }) aSelected!: ASelectedType
  @Prop({ required: false }) userId!: string | null

  // 根据articelUrl是否允许使用跨域iframe，来返回不同tabUrl
  new_tab_url(
    id: number,
    isAllowedFrame: boolean = true,
    articleUrl: string | undefined
  ) {
    let tabUrl = `${process.env.VUE_APP_BASE_PATH}/#/learn/content/${id}`
    if (!isAllowedFrame && articleUrl) {
      // 使用原始url
      tabUrl = articleUrl
    }
    return tabUrl
  }
  async readArticle(articleId: string) {
    console.log("readArticle id:", articleId)
    const isAdded: boolean = await LearnModule.AddNewRead(articleId)
    if (isAdded) {
      // 更新cards
      console.log("udapte cards")
      // this.updateSetLearnCards(this.aSelected)
      this.isAdded()
    }
  }
  @Emit()
  isAdded() {
    return this.aSelected
  }
  async deleteArticle(articleId: string) {
    const isDelete = confirm("删除该文章?")
    if (isDelete) {
      const res: any = await Learn.deleteCard({
        articleId
      })
      console.log("res: ", res)
      if (resSuccess(res)) {
        console.log("success")
        // this.deleteArticleCard(articleId)
        this.deleteArticleSucceeded(articleId)
      }
    }
  }
  @Emit()
  deleteArticleSucceeded(articleId: string) {}
}
</script>

<style lang='scss' scoped>
.article-wrapper {
  position: relative;
  margin: 10px;
  overflow: hidden;
  .delete-card {
    color: red;
    position: absolute;
    right: 0;
    top: -38px;
    font-size: 33px;
    background: #9e9e9eb8;
    transition: all 0.3s;
  }
  &:hover .delete-card {
    opacity: 1;
    top: 0;
  }
}
</style>