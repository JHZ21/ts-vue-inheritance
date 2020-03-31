<template>
  <main class="main">
    <div class="learn_panel_wrapper">
      <div class="learn_panel">
        <div class="panel_top clearfix">
          <div class="rotation_img"
            :style="{ backgroundImage: `url(${rotation_img_urls[rotation_img_index]})` }"></div>
          <search-input class="search_input"
            placeholder="快速查找文章/enter 确认"
            @set_search_val="set_search_val"></search-input>
        </div>
        <nav-menu :nav_data="nav_data"
          @update_selected_erea="updateASelected"></nav-menu>
        <sort-selection-bar class="sort-bar-wrapper"
          :sortContent='["按时间", "按热度"]'
          @switch-sort="switchSort"></sort-selection-bar>
      </div>
    </div>
    <div class="container">
      <transition-group class="transition-box"
        v-show="!isEmptycurrCards"
        name="slide-up">
        <open-new-tab v-for="(cardData) in currntPageCard"
          :key="cardData.timeStamp"
          :url="new_tab_url(cardData.id, cardData.isAllowedFrame, cardData.articleUrl)"
          @opened="readArticle(cardData.id)">
          <article-card class="article_card"
            :cardData="cardData"></article-card>
        </open-new-tab>
      </transition-group>
      <div class="null-data"
        v-show="isEmptycurrCards"> 此页面还没有内容, 快来分享吧 </div>
      <div class="fixed-right-box">
        <el-pagination class="pagination"
          background
          layout="prev, pager, next"
          :page-size="pageCardSize"
          :total="selected_eara_cardList.length"
          :current-page.sync="currentPage"></el-pagination>
        <submit-form title="分享链接"
          v-if="isLogin"
          :prop_form="form"
          @init_form_data="init_form_data"
          @upload_form_data="upload_form_data">
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
                  slot="tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </submit-form>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import ArticleCard from "@/components/ArticleCard.vue"
import {
  CardData,
  NavRow,
  NestedCardList,
  UpdateStoreDataType,
  GetDataType
} from "@/utils/interface.ts"
import { oContentUrlType, LearnModule } from "@/store/modules/learn.ts"
import * as Learn from "@/api/learn"
import NavMenu from "@/components/NavMenu.vue"
import SearchInput from "@/components/SearchInput.vue"
import OpenNewTab from "@/components/OpenNewTab.vue"
import SubmitForm from "@/components/SubmitForm.vue"
import { deep_copy, props_not_empty, vaild_local } from "@/utils/func"
import { AddCardMixin, CommonMixin, LearnCompetMixin } from "@/utils/mixins"
import * as Forage from "@/utils/localForage"
import SortSelectionBar from "./components/SortSelectionBar.vue"
import { UserModule } from "@/store/modules/user"

interface ArticleFormType {
  article_url: string
  img: any
  title: string
  dialogFormVisible: boolean
}

@Component({
  name: "Learn",
  components: {
    ArticleCard,
    NavMenu,
    SearchInput,
    OpenNewTab,
    SubmitForm,
    SortSelectionBar
  },
  mixins: [AddCardMixin, CommonMixin, LearnCompetMixin]
})
export default class extends Vue {
  rotation_img_urls: string[] = [] // 轮播图组路径
  rotation_img_index: number = 0 // 轮播图当前图片下标
  rotation_task: number = 0 // 轮播定时器
  nav_data: NavRow[] = [] // 导航选择栏数据
  aSelected: number[] = [0, 0, 0] // 用户选择的方向、分类、级别 信息
  search_input_val: string = ""
  to_search_val: string = ""
  pageCardSize: number = 30 //一页展示card容量
  currentPage: number = 1 // 当前显示的页码 与分页组件同步 sync
  // allCardList: NestedCardList = [] // 所有的card数据
  //dialog form
  default_form_data: any = {}
  form: ArticleFormType = {
    article_url: "",
    img: null,
    title: "",
    dialogFormVisible: false
  }
  currCards: CardData[] = [] // 当前类的卡片集
  sortKey: number = 0
  sortProps: string[] = ["timeStamp", "readVolume"]

  get isEmptycurrCards(): boolean {
    return !this.currCards || this.currCards.length < 1
  }

  // 计算当前类cardList
  get selected_eara_cardList(): CardData[] {
    if (this.currCards && this.currCards.length < 1) return []
    let curr_cardList: CardData[] = this.currCards
    if (this.to_search_val) {
      curr_cardList = this.filter_by_match_article_rule(this.currCards)
    }
    // 反转
    const firstProp = this.sortProps[this.sortKey]
    const secondProp = this.sortProps.filter(p => p !== firstProp)[0]
    console.log(firstProp, secondProp)
    // 优先 firstProp 降序，相同时，再按 secondProp 降序
    curr_cardList.sort((a, b) => {
      const prev: any = a
      const curr: any = b
      const res: number =
        curr[firstProp] - prev[firstProp] || curr[secondProp] - prev[secondProp]
      return res
    })
    return curr_cardList
  }

  //随页码自响应更新当前页的card数据
  //TODO: 体验bug, 换页时，页面视野区应该上移， 显示页面第一行card
  //TODO: 还未应用search_val 如Competition多词搜索
  get currntPageCard(): CardData[] {
    const index = this.currentPage - 1
    return this.selected_eara_cardList.slice(
      index * this.pageCardSize,
      (index + 1) * this.pageCardSize
    )
  }

  switchSort(key: number) {
    this.sortKey = key
  }

  //TODO: 收到返回数据后，currCards，
  // 和该类的forage也应更新，使得用户有良好的反馈体验
  upload_form_data() {
    const aSelected: number[] = this.aSelected
    let form = this.form
    let formdata: FormData = new FormData()
    formdata.append("articleUrl", form.article_url)
    formdata.append("title", form.title)
    formdata.append("aSelected", JSON.stringify(aSelected))
    formdata.append("file", form.img)
    Learn.uploadLearnCard(formdata)
      .then(res => {
        if (res.data.code === 200) {
          this.form.dialogFormVisible = false
          const card = res.data.card
          if (card && card.id && card.articleUrl) {
            const articleKey = `article-${card.id}`
            console.log("setLocalForage", articleKey)
            Forage.setLocalForage(articleKey, {
              articleUrl: card.articleUrl,
              comments: card.comments || []
            })
            // 从后端获取更新的cards数据，刷新页面
            this.updateSetLearnCards(aSelected)
          }
        }
        console.log("res.data:", res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  start_rotation() {
    this.rotation_img_index = Math.floor(
      Math.random() * this.rotation_img_urls.length
    )
    // this.rotation_task = setInterval(() => {
    //   this.rotation_img_index++
    //   if (this.rotation_img_index >= this.rotation_img_urls.length)
    //     this.rotation_img_index = 0
    // }, 5000)
  }
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
  set_search_val(search_val: string) {
    this.to_search_val = search_val
  }

  updateASelected(aSelected: number[]) {
    this.aSelected = aSelected
  }

  match_article_rule(cardData: CardData): boolean {
    return new RegExp(this.to_search_val).test(cardData.title)
  }

  filter_by_match_article_rule(cardList: CardData[]): CardData[] {
    return cardList.filter((cardData: CardData) =>
      this.match_article_rule(cardData)
    )
  }

  select_item(row_key: number, item_key: number): void {
    Vue.set(this.aSelected, row_key, item_key)
  }
  @Watch("aSelected", { immediate: true, deep: true })
  onSelectedErea(aSelected: number[]) {
    console.log("aSelected: ", aSelected)

    this.getSetLearnCards(aSelected)
  }
  getRotationUrl() {
    const rotationUrlKey = "rotationUrlKey"
    Forage.getVailLocalForage(rotationUrlKey, 30).then(data => {
      if (data) {
        this.rotation_img_urls = data as string[]
        console.log(rotationUrlKey, "get localForage")
      } else {
        Learn.getLearnRotationUrl()
          .then(res => {
            if (res && res.data && res.data.rotationUrl) {
              this.rotation_img_urls = res.data.rotationUrl
              Forage.setLocalForage(rotationUrlKey, res.data.rotationUrl)
              console.log(rotationUrlKey, "get network")
            } else {
              console.log(res)
            }
          })
          .catch(err => {
            console.log("err: ", err)
          })
      }
    })
  }
  async readArticle(articleId: string) {
    console.log("readArticle id:", articleId)
    const isAdded: boolean = await LearnModule.AddNewRead(articleId)
    if (isAdded) {
      // 更新cards
      console.log("udapte cards")
      this.updateSetLearnCards(this.aSelected)
    }
  }
  localCardsKey(aSelected: number[]): string {
    const strSelected: string = aSelected.join("-")
    return `learnCards-${strSelected}`
  }

  updateStoreData!: UpdateStoreDataType
  getData!: GetDataType

  // 关于 learnCards
  // 从后端更新learCards返回
  async updateLearnCards(aSelected: number[]) {
    const localLearnCardsKey = this.localCardsKey(aSelected)
    return this.updateStoreData(
      Learn.getLearnCards,
      { aSelected },
      localLearnCardsKey,
      "cards"
    )
  }
  // 更新并设置learnCards
  async updateSetLearnCards(aSelected: number[]) {
    this.setLearnCards(await this.updateLearnCards(aSelected))
  }
  //  获取learnCards
  async getLearnCards(aSelected: number[]) {
    const localLearnCardsKey = this.localCardsKey(aSelected)
    return this.getData(
      this.updateLearnCards,
      aSelected,
      localLearnCardsKey,
      10
    )
  }
  // 获取并设置learnCards
  async getSetLearnCards(aSelected: number[]) {
    this.setLearnCards(await this.getLearnCards(aSelected))
  }
  setLearnCards(learnCards: CardData[]) {
    if (!learnCards) return ""
    this.currCards = learnCards
  }

  // 关于 leanNavData
  getNavData!: Function
  async getLearnNavData() {
    return this.getNavData(Learn.getLearnNavData, "learnNavData")
  }
  async getSetLearnNavData() {
    this.setLearnNavData(await this.getLearnNavData())
  }
  setLearnNavData(navData: NavRow[]) {
    if (!navData) {
      console.log(`setLearnNavData:${navData}`)
      return ""
    }
    this.nav_data = navData
  }

  async created() {
    // 数据赋值
    this.default_form_data = deep_copy(this.form)
    this.getSetLearnNavData()
    this.getSetLearnCards(this.aSelected)
    this.getRotationUrl()
    LearnModule.GetRead()
  }

  mounted() {
    // 启动轮播图
    this.start_rotation()
  }
  beforeDestroy() {
    // 清除轮播定时器
    this.rotation_task && clearTimeout(this.rotation_task)
  }
}
</script>

<style lang="scss" scoped>
@import "./Learn.scss";
</style>
