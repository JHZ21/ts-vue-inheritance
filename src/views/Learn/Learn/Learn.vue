<template>
  <main class="main">
    <div class="learn_panel_wrapper">
      <div class="learn_panel">
        <div class="panel_top clearfix">
          <div class="rotation_img"
            :style="{ backgroundImage: `url(${rotation_img_urls[rotation_img_index]})` }"></div>
          <search-input class="search_input"
            placeholder="快速查找文章/enter"
            @set_search_val="set_search_val"></search-input>
        </div>
        <nav-menu :nav_data="nav_data"
          @update_selected_erea="update_selected_erea"></nav-menu>
      </div>
    </div>
    <div class="container">
      <transition-group class="transition-box"
        name="slide-up">
        <open-new-tab v-for="(cardData) in currntPageCard"
          :key="cardData.timeStamp"
          :url="new_tab_url(cardData.id)">
          <article-card class="article_card"
            :cardData="cardData"></article-card>
        </open-new-tab>
      </transition-group>
      <div class="fixed-right-box">
        <el-pagination class="pagination"
          background
          layout="prev, pager, next"
          :page-size="pageCardSize"
          :total="selected_eara_cardList.length"
          :current-page.sync="currentPage"></el-pagination>
        <add-card title="分享链接"
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
                  slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </add-card>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import ArticleCard from "@/components/ArticleCard.vue"
import { CardData, NavRow, NestedCardList } from "@/utils/interface.ts"
import { oContentUrlType, LearnModule } from "@/store/modules/learn.ts"
import { getLearnCard } from "@/api/learn"
import NavMenu from "@/components/NavMenu.vue"
import SearchInput from "@/components/SearchInput.vue"
import OpenNewTab from "@/components/OpenNewTab.vue"
import AddCard from "@/components/AddCard.vue"
// import AddCard from "./components/AddCard.vue"
import axios from "axios"
import { deep_copy, props_not_empty } from "@/utils/func"
import { AddCardMixin } from "@/utils/mixins"

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
    AddCard
  },
  mixins: [AddCardMixin]
})
export default class extends Vue {
  rotation_img_urls: string[] = [] // 轮播图组路径
  rotation_img_index: number = 0 // 轮播图当前图片下标
  nav_data: NavRow[] = [] // 导航选择栏数据
  selected_erea: number[] = [0, 0, 0] // 用户选择的方向、分类、级别 信息
  search_input_val: string = ""
  to_search_val: string = ""
  pageCardSize: number = 30 //一页展示card容量
  currentPage: number = 1 // 当前显示的页码 与分页组件同步 sync
  allCardList: NestedCardList = [] // 所有的card数据
  //dialog form
  default_form_data: any = {}
  // default_form_data: ArticleFormType = {
  //   article_url: "",
  //   img: null,
  //   title: "",
  //   dialogFormVisible: false
  // }
  form: ArticleFormType = {
    article_url: "",
    img: null,
    title: "",
    dialogFormVisible: false
  }

  // 计算当前类cardList
  get selected_eara_cardList(): CardData[] {
    if (!this.allCardList[0]) return []
    let curr_cardList: CardData[] = []
    const selected_erea = this.selected_erea
    curr_cardList = this.allCardList[selected_erea[0]][selected_erea[1]][
      selected_erea[2]
    ]
    if (this.to_search_val) {
      curr_cardList = this.filter_by_match_article_rule(curr_cardList)
    }
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

  upload_form_data() {
    let form = this.form
    let formdata: FormData = new FormData()
    formdata.append("article_url", form.article_url)
    formdata.append("title", form.title)
    formdata.append("img", form.img)
    // let config = {
    //   headers: { "Content-Type": "multipart/form-data" } //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
    // }
    axios({
      method: "post",
      url: "http://localhost:2127/image",
      data: formdata
    })
      .then(res => {
        console.log("res.data:", res.data)
        this.form.dialogFormVisible = false
      })
      .catch(err => {
        console.log(err)
      })
  }

  start_rotation() {
    setInterval(() => {
      this.rotation_img_index++
      if (this.rotation_img_index >= this.rotation_img_urls.length)
        this.rotation_img_index = 0
    }, 5000)
  }
  new_tab_url(id: number) {
    return `http://localhost:8080/#/learn/content/${id}`
  }
  set_search_val(search_val: string) {
    this.to_search_val = search_val
  }

  update_selected_erea(selected_erea: number[]) {
    this.selected_erea = selected_erea
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
    Vue.set(this.selected_erea, row_key, item_key)
  }

  created() {
    // 数据赋值
    this.default_form_data = deep_copy(this.form)
    getLearnCard().then(res => {
      let data = res.data
      setTimeout(() => {
        this.rotation_img_urls = data.rotation_img_urls
        this.nav_data = data.nav_data
        this.allCardList = data.allCardList
      }, 1000)
    })
  }

  mounted() {
    // 启动轮播图
    this.start_rotation()
  }
}
</script>

<style lang="scss" scoped>
@import "./Learn.scss";
</style>
