<template>
  <main class="main">
    <div class="learn_panel_wrapper">
      <div class="learn_panel">
        <div class="panel_top clearfix">
          <div
            class="rotation_img"
            :style="{ backgroundImage: `url(${rotation_img_url})` }"
          ></div>
          <search-input
            class="search_input"
            placeholder="快速查找文章/enter"
            @set_search_val="set_search_val"
          ></search-input>
        </div>
        <nav-menu
          :nav_data="nav_data"
          @update_selected_erea="update_selected_erea"
        ></nav-menu>
      </div>
    </div>
    <div class="container">
      <open-new-tab
        v-for="(cardData, key) in currntPageCard"
        :key="key"
        :url="new_tab_url(cardData.id)"
      >
        <article-card class="article_card" :cardData="cardData"></article-card>
      </open-new-tab>

      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-size="pageCardSize"
        :total="selected_eara_cardList.length"
        :current-page.sync="currentPage"
      >
      </el-pagination>
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
import OpenNewTab from "../../components/OpenNewTab.vue"

@Component({
  name: "Learn",
  components: {
    ArticleCard,
    NavMenu,
    SearchInput,
    OpenNewTab
  }
})
export default class extends Vue {
  rotation_img_index: number = 1 // 轮播图当前图片
  img_url: string[] = [] // 实际图片路径
  nav_data: NavRow[] = [] // 导航选择栏数据
  selected_erea: number[] = [0, 0, 0] // 用户选择的方向、分类、级别 信息
  search_input_val: string = ""
  to_search_val: string = ""
  pageCardSize: number = 30 //一页展示card容量
  currentPage: number = 1 // 当前显示的页码 与分页组件同步 sync
  allCardList: NestedCardList = [] // 所有的card数据

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
  get currntPageCard(): CardData[] {
    const index = this.currentPage - 1
    return this.selected_eara_cardList.slice(
      index * this.pageCardSize,
      (index + 1) * this.pageCardSize
    )
  }
  // 随rotation_img_index自响应改变轮播图片
  get rotation_img_url(): string {
    const index = this.rotation_img_index
    const img_url: string[] = this.img_url
    img_url[index] ||
      (img_url[
        index
      ] = require(`@/assets/learn/rotation/rotation_0${index}.jpg`))
    return img_url[index]
  }
  new_tab_url(id: number) {
    return `http://localhost:8080/#/learn/content/${id}`
  }
  set_search_val(search_val: string) {
    this.to_search_val = search_val
    console.log("update", search_val, this.to_search_val)
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
    const learnVueObj = this
    getLearnCard().then(res => {
      learnVueObj.nav_data = res.data.nav_data
      learnVueObj.allCardList = res.data.allCardList
    })
  }

  mounted() {
    // 定时改变轮播图片
    setInterval(() => {
      this.rotation_img_index++
      if (this.rotation_img_index > 3) this.rotation_img_index = 1
    }, 5000)
  }
  // traverseAllCardList(nestedCardList: NestedCardList, func: Function) {
  //   // 方向 类别 级别 cardData[]
  //   nestedCardList.forEach(direction => {
  //     direction.forEach(category => {
  //       category.forEach(aCardData => {
  //         aCardData.forEach(cardData => {
  //           func(cardData);
  //         });
  //       });
  //     });
  //   });
  // }
  // set_selected_eara_cardList(selected_erea: number[]) {
  //   if (this.allCardList.length < 1) return "";
  //   this.selected_eara_cardList = this.allCardList[selected_erea[0]][
  //     selected_erea[1]
  //   ][selected_erea[2]];
  // }
  // 随selected_erea自响应selected_eara_cardList数据内容
  // @Watch("selected_erea", { immediate: true, deep: true })
  // auto_set_selected_eara_cardList(selected_erea: number[]) {
  //   this.set_selected_eara_cardList(selected_erea);
  // }
  // search_article() {
  //   if (!this.search_input_val) return;
  //   console.log(this.search_input_val);
  //   const findCardDatas: CardData[] = [];
  //   this.traverseAllCardList((cardData: CardData) => {
  //     this.matchArticleRule(cardData) && findCardDatas.push(cardData);
  //   });
  //   this.selected_eara_cardList = findCardDatas;
  // }
}
</script>

<style lang="scss" scoped>
.main {
  min-height: calc(100% - #{$header-height});
  background: $bg-color;
  .learn_panel_wrapper {
    @include top-panel();
    .learn_panel {
      @include layout-width();
      margin: auto;
      .panel_top {
        padding: 10px 0;
        border-bottom: $thin-broder;
        .rotation_img {
          float: left;
          width: 200px;
          height: 100px;
          border: $thin-broder;
          background-image: url("../../assets/learn/rotation/rotation_01.jpg");
          background-size: cover;
          background-position: center center;
        }
        .search_input {
          float: right;
          padding-right: 40px;
        }
      }
      .panel_content {
        .nav_row {
          display: flex;
          height: 100%;
          font-size: 15px;
          justify-content: flex-start;
          .nav_label {
            position: absolute;
            width: 52px;
            height: 32px;
            margin-top: 10px;
            line-height: 32px;
            font-weight: 700;
            color: #07111b;
            text-align: left;
          }
          .nav_items_wrapper {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            margin-left: 60px;
            .nav_item {
              margin: 5px 20px;
              height: 32px;
              padding: 6px 10px;
              line-height: 32px;
              &:hover {
                background-color: rgba(48, 79, 104, 0.5);
                padding: 6px 10px;
                border-radius: 4px;
                color: #fff;
              }
              &.selected {
                background-color: #575a8a;
                padding: 6px 10px;
                border-radius: 4px;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
  .container {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    @include layout-width();
    padding: 10px 0 20px;
    .article_card {
      margin: 10px;
    }
    .pagination {
      @include right-pagination();
      // position: fixed;
      // right: 0;
      // bottom: 33.33%;
      // display: flex;
      // flex-direction: column;
      // opacity: 0.8;
      // // 对子组件样式修改ddep/
      // & /deep/ .el-pager {
      //   display: flex;
      //   flex-direction: column;
      // }
    }
  }
}
</style>
