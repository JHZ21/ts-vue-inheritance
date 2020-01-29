<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <my-header></my-header>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";

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
  background-color: #f8fafc;
  overflow-y: scroll;
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
