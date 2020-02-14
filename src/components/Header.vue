<template>
  <div class="header">
    <div class="header_container" v-if="showHeaderContent()">
      <ul class="nav">
        <li v-for="(link, key) in links" :key="key">
          <router-link :to="link.to">{{ link.text }}</router-link>
        </li>
      </ul>
      <div class="header_right">
        <div class="user_area">
          <div class="header_avator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// export default {
//   name: "Header"
// };
import { Vue, Prop, Component } from "vue-property-decorator"

interface RouterLink {
  to: string
  text: string
}

@Component
export default class Header extends Vue {
  data() {
    return {
      links: [
        { to: "/learn", text: "学习区" },
        { to: "/competition", text: "竞赛区" },
        { to: "/plan", text: "规划区" },
        { to: "/partners", text: "伙伴们" },
        { to: "/analysis", text: "分析" }
      ]
    }
  }
  showHeaderContent(): boolean {
    return !new RegExp(/^\/learn\/content\//).test(this.$route.fullPath)
  }
}
</script>
<style lang="scss" scoped>
.header {
  background-color: #07111b;
  height: $header-height;
  // height: 40px;
  // background-color: #575a8a;
  .header_container {
    @include layout-width();
    display: flex;
    height: 40px;
    font-size: 14px;
    margin: 0 auto;
    .nav {
      list-style: none;
      margin: 0 auto;
      margin-left: -40px;
      li:nth-child(1) a {
        padding-left: 0;
      }
      li {
        float: left;
        a {
          display: block;
          height: 40px;
          line-height: 40px;
          color: #717a84;
          font-weight: bold;
          padding: 0 18px;
          text-decoration: none;
          &:hover {
            color: #eee;
          }
          &.router-link-exact-active {
            color: #fff;
          }

          @media screen and (max-width: 1479px) {
            & {
              padding: 0 10px !important;
            }
          }
          @media screen and (max-width: 1270px) {
            & {
              padding: 0 5px !important;
            }
          }
        }
      }
    }
    .header_right {
      float: right;
      display: flex;
      height: 40px;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .header_avator {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-image: url("~@/assets/images/header_avator.gif");
        // background-image: url("../assets/images/header_avator.gif");
        background-size: 100% 100%;
      }
    }
  }
}
</style>
