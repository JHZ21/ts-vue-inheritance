<template>
  <span class="switch-page"
    :class="{right: right}"><a :href="aHref()">
      <slot></slot>
    </a></span>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator"

@Component({
  name: "SwitchPage"
})
export default class extends Vue {
  @Prop({ required: true }) path!: string
  @Prop() right!: boolean
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
  &.right {
    text-align: right;
    width: 100%;
    display: inline-block;
  }
  // display: inline-block;
  // position: relative;
  // text-align: right;
  a {
    font-size: 14px;
    color: #409eff;
  }
}
</style>