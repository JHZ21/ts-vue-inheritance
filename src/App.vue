<template>
  <div id="app">
    <my-header></my-header>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Header from "@/components/Header.vue"
// import { setHtmlFontSize } from "@/utils/func";
// setHtmlFontSize();

@Component({
  name: "App",
  components: {
    MyHeader: Header
  }
})
export default class extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
  min-width: 1200px;
  background-color: $bg-color;
  // 竖轴滚动条一直存在，保证窗口宽度不会变化
  overflow-y: scroll;
  overflow-x: hidden;
}
.clearfix {
  *zoom: 1;
}
.clearfix:after {
  content: "\0020";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
