<template>
  <div class="background">
    <div class="form-box">
      <span class="title">{{title}}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator"

@Component({
  name: "Wrapper"
})
export default class extends Vue {
  @Prop() title!: string
}
</script>

<style lang='scss' scoped>
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: $theme-color;
}
.title {
  display: inline-block;
  position: relative;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin: 30px;
  color: #fff;
}
.form-box {
  position: relative;
  width: 450px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  & /deep/ form {
    position: relative;
  }
}
</style>