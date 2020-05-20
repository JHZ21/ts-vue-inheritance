<template>
  <div class="article-wrapper">
    <open-new-tab :url="new_tab_url(cardData.id, cardData.isAllowedFrame, cardData.articleUrl)"
      @opened="readArticle(cardData.id)">
      <article-card class="article_card"
        :cardData="cardData"></article-card>
    </open-new-tab>
    <transition name="slide-down">
      <i v-if="userId && hasPermission(['admin', cardData.uploader.userId])"
        class="iconfont icon-bianji edit-card"
        @click.stop="editCard()"></i>
    </transition>
    <el-dialog title="文章修改"
      :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="目标分类:"
          :label-width="labelWidth"
          class="form-row">
          <el-cascader v-model="form.aSelected"
            :options="navOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="删除文章:"
          :label-width="labelWidth"
          class="form-row">
          <el-button type="danger"
            @click="deleteArticle(cardData.id)">删除文章</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
          @click="confirmForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit } from "vue-property-decorator"
import OpenNewTab from "@/components/OpenNewTab.vue"
import ArticleCard from "@/components/ArticleCard.vue"
import { LearnModule } from "@/store/modules/learn"
import { CardData, ASelectedType, NavRow } from "@/utils/interface"
import { resSuccess } from "@/utils/func"
import { CommonMixin } from "@/utils/mixins"
import * as Learn from "@/api/learn"

interface optionType {
  label: string
  value: string
  children?: optionType[]
}
type optionsType = optionType[]
interface objOptionsType {
  [prop: string]: optionsType
}

@Component({
  name: "ArticleCardWrapper",
  components: {
    OpenNewTab,
    ArticleCard
  },
  mixins: [CommonMixin]
})
export default class extends Vue {
  @Prop({ required: true }) cardData!: CardData
  @Prop({ required: true }) navData!: NavRow[]
  @Prop({ required: true }) aSelected!: ASelectedType
  @Prop({ required: false }) userId!: string | null
  dialogFormVisible: boolean = false
  labelWidth: string = "80px"
  get navOptions(): optionsType {
    let options: optionsType = []
    if (this.navData && Array.isArray(this.navData)) {
      options = this.navData
        .map(navRow => {
          return navRow.aData
        })
        .reduceRight((right, left) => {
          return transform(left, right)
        }, undefined)
      // 转为 options 所需格式， children若有，则已为目标格式
      function transform(
        obj: any,
        children?: optionsType | objOptionsType
      ): optionsType | objOptionsType {
        let result: any = {}
        if (Array.isArray(obj)) {
          result = obj.map(item => ({
            label: item.text,
            value: item.id,
            children: !children
              ? undefined
              : Array.isArray(children)
              ? children
              : children[item.id]
          }))
        } else {
          // obj: objOptionsType
          for (let key in obj) {
            result[key] = transform(obj[key], children)
          }
        }
        return result
      }
    }
    return options
  }
  form: any = {
    delete: false,
    aSelected: []
  }
  newASelected: ASelectedType = []

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
        this.dialogFormVisible = false
      }
    }
  }
  @Emit()
  deleteArticleSucceeded(articleId: string) {}
  editCard() {
    this.dialogFormVisible = true
    this.form.aSelected = [].concat([], this.aSelected as any)
  }
  async confirmForm() {
    let changed: boolean = !this.aSelected.every(
      (item, index) => item === this.form.aSelected[index]
    )
    if (!changed) return
    const params: any = {
      articleId: this.cardData.id,
      aSelected: this.aSelected,
      newASelected: this.form.aSelected
    }
    const res: any = await Learn.transferCard(params)
    if (resSuccess(res)) {
      this.transferCardSucceeded(params)
      this.dialogFormVisible = false
    }
  }
  @Emit()
  transferCardSucceeded(params: any) {}

  // created() {

  //   console.log(
  //     "hasPermission: ",
  //     this.hasPermission(['admin', this.cardData.uploader.userId],
  //     is,
  //     this.userId,
  //     this.cardData.uploader.userId
  //   )
  // }
}
</script>

<style lang='scss' scoped>
.article-wrapper {
  position: relative;
  margin: 10px;
  overflow: hidden;
  .edit-card {
    color: $selected-color;
    position: absolute;
    right: 0;
    top: -45px;
    font-size: 30px;
    background: #9e9e9eb8;
    transition: all 0.3s;
    padding: 5px;
  }
  &:hover .edit-card {
    opacity: 1;
    top: 0;
  }
  .form-row {
    display: flex;
  }
}
</style>