<template>
  <div @mousedown="divMousedown()"
    @mouseup="divMouseup()">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"

@Component({
  name: "OpenNewTab"
})
export default class extends Vue {
  @Prop({ required: true }) url!: string
  divClickedTime: number = 0
  divMousedown() {
    this.divClickedTime = new Date().getTime()
  }

  divMouseup() {
    // 防误触
    if (this.divClickedTime + 300 > new Date().getTime()) {
      this._openContentTab()
    }
  }
  private _openContentTab() {
    window.open(this.url, "_blank")
    this.$emit("opened")
  }
}
</script>
