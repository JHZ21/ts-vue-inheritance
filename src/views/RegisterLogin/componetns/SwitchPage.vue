<template>
  <span class="switch-page"><a :href="aHref()">{{msg}}</a></span>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator"

@Component({
  name: "SwitchPage"
})
export default class extends Vue {
  @Prop({ required: true }) msg!: string
  @Prop({ required: true }) path!: string
  aHref() {
    if (this.path) {
      return `#${this.path}`
    } else {
      return "#"
    }
  }
}
</script>

<style lang='scss' scoped>
.switch-page {
  display: inline-block;
  position: relative;
  width: 100%;
  text-align: right;
  a {
    font-size: 14px;
    color: #409eff;
  }
}
</style>