<template>
  <main class="main">
    <div class="learn_panel_wrapper">
      <div class="learn_panel">
        <div class="panel_top clearfix">
          <div
            class="rotation_img"
            :style="{ backgroundImage: rotation_img_url }"
          ></div>
          <div class="search_wrapper">
            <input
              class="search_input"
              type="text"
              placeholder="快速查找文章"
              v-model="search_input_val"
              @keyup.enter.exact="search_article()"
            />
            <div class="search_icon_wrapper">
              <i class="iconfont icon-icon-test" @click="search_article()"></i>
            </div>
          </div>
        </div>
        <div class="panel_content">
          <div
            class="nav_row"
            v-for="(nav_row, row_key) in nav_data"
            :key="row_key"
          >
            <span class="nav_label">{{ nav_row.label }}</span>
            <div class="nav_items_wrapper">
              <div
                class="nav_item"
                v-for="(nav_item, item_key) in Array.isArray(nav_row.aData[0])
                  ? nav_row.aData[selected_erea[0]]
                  : nav_row.aData"
                :key="item_key"
                @click="select_item(row_key, item_key)"
                :class="{ selected: selected_erea[row_key] === item_key }"
              >
                {{ nav_item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <article-card
        class="article_card"
        v-for="(cardData, key) in currntPageCard"
        :cardData="cardData"
        :key="key"
      ></article-card>
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
import axios from "axios";
import { Vue, Component, Watch } from "vue-property-decorator";
import ArticleCard from "@/components/ArticleCard.vue";
import { CardData, NavRow } from "@/utils/interface.ts";
import { oContentUrlType, LearnModule } from "@/store/modules/learn.ts";

@Component({
  name: "Learn",
  components: {
    ArticleCard: ArticleCard
  }
})
export default class extends Vue {
  rotation_img_index: number = 1; // 轮播图当前图片

  nav_data: NavRow[] = []; // 导航选择栏数据
  selected_erea: number[] = [0, 0, 0]; // 用户选择的方向、分类、级别 信息
  search_input_val: string = "";

  pageCardSize: number = 30; //一页展示card容量
  currentPage: number = 1; // 当前显示的页码 与分页组件同步 sync
  allCardList: CardData[][][][] = []; // 所有的card数据
  selected_eara_cardList: CardData[] = []; // 当前细类的card数据

  set_selected_eara_cardList(selected_erea: number[]) {
    if (this.allCardList.length < 1) return "";
    this.selected_eara_cardList = this.allCardList[selected_erea[0]][
      selected_erea[1]
    ][selected_erea[2]];
  }
  // 随selected_erea自响应selected_eara_cardList数据内容
  @Watch("selected_erea", { immediate: true, deep: true })
  auto_set_selected_eara_cardList(selected_erea: number[]) {
    this.set_selected_eara_cardList(selected_erea);
  }
  //随页码自响应更新当前页的card数据
  //TODO: 体验bug, 换页时，页面视野区应该上移， 显示页面第一行card
  get currntPageCard(): CardData[] {
    const index = this.currentPage - 1;
    return this.selected_eara_cardList.slice(
      index * this.pageCardSize,
      (index + 1) * this.pageCardSize
    );
  }
  // 随rotation_img_index自响应改变轮播图片
  get rotation_img_url() {
    return `url(${require(`../../assets/learn/rotation/rotation_0${this.rotation_img_index}.jpg`)})`;
  }
  traverseAllCardList(func: Function) {
    // 方向 类别 级别 cardData[]
    this.allCardList.forEach(direction => {
      direction.forEach(category => {
        category.forEach(aCardData => {
          aCardData.forEach(cardData => {
            func(cardData);
          });
        });
      });
    });
  }
  matchArticleRule(cardData: CardData) {
    return new RegExp(this.search_input_val).test(cardData.title);
  }
  search_article() {
    if (!this.search_input_val) return;
    console.log(this.search_input_val);
    const findCardDatas: CardData[] = [];
    this.traverseAllCardList((cardData: CardData) => {
      this.matchArticleRule(cardData) && findCardDatas.push(cardData);
    });
    this.selected_eara_cardList = findCardDatas;
  }
  select_item(row_key: number, item_key: number): void {
    Vue.set(this.selected_erea, row_key, item_key);
  }
  created() {
    // 数据赋值
    const learnVueObj = this;
    axios({
      method: "get",
      url: "learn/card"
    }).then(res => {
      learnVueObj.nav_data = res.data.nav_data;
      learnVueObj.allCardList = res.data.allCardList;
      // 初始设置当前选中部分cardData[]
      learnVueObj.set_selected_eara_cardList(learnVueObj.selected_erea);
    });
  }
  mounted() {
    // 定时改变轮播图片
    setInterval(() => {
      this.rotation_img_index++;
      if (this.rotation_img_index > 3) this.rotation_img_index = 1;
    }, 5000);
  }
}
</script>

<style lang="scss" scoped>
.main {
  min-height: calc(100% - 140px);
  background: #f9f9f9;
  .learn_panel_wrapper {
    background-color: #fff;
    padding-bottom: 12px;
    box-shadow: 0 4px 8px 0 rgba(50, 56, 60, 0.1);
    .learn_panel {
      @include layout-width();
      margin: auto;
      .panel_top {
        padding: 10px 0;
        border-bottom: 1px solid rgba(34, 38, 41, 0.2);
        .rotation_img {
          float: left;
          width: 200px;
          height: 100px;
          border: 1px solid rgba(34, 38, 41, 0.2);
          background-image: url("../../assets/learn/rotation/rotation_01.jpg");
          background-size: cover;
          background-position: center center;
        }
        .search_wrapper {
          float: right;
          padding-right: 40px;
          margin: 12px 0;
          width: 466px;
          height: 36px;
          line-height: 36px;
          background: #f3f5f6;
          border-radius: 8px;
          border: 0;
          position: relative;
          @media screen and (max-width: 1479px) {
            & {
              width: 300px;
            }
          }
          .search_input {
            width: 100%;
            padding: 0 16px;
            color: #1c1f21;
            background-color: transparent;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            outline: 0;
            border: 0;
          }
          .search_icon_wrapper {
            width: 24px;
            height: 24px;
            font-size: 24px;
            color: #9199a1;
            text-align: right;
            position: absolute;
            display: inline-block;
            right: 16px;
            bottom: 12px;
            cursor: pointer;
            .iconfont {
              font-size: 24px;
            }
          }
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
      position: fixed;
      right: 0;
      bottom: 33.33%;
      display: flex;
      flex-direction: column;
      opacity: 0.8;
      // 对子组件样式修改ddep/
      & /deep/ .el-pager {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
