<template>
  <div class="sort-selection-bar">
    <div class="sort-btn"
      v-for="(content, key) in sortContent"
      :class="{selected: key === selectedKey}"
      @click="switchSort(key)"
      :key="content">
      {{content}}
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit } from "vue-property-decorator"

@Component({
  name: "SortSelectionBar"
})
export default class extends Vue {
  @Prop() sortContent!: string[]
  // sortContent: string[] = ["按时间", "按热度"]
  selectedKey: number = 0

  @Emit()
  switchSort(Key: number) {
    this.selectedKey = Key
  }
}
</script>

<style lang='scss' scoped>
.sort-selection-bar {
  display: flex;
}
.sort-btn {
  width: 90px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  border: 1px solid rgb(100, 85, 85);
  border-left-width: 0;
  &:nth-of-type(1) {
    border-left-width: 1px;
  }
  background-color: transparent;
  &:not(.selected):hover {
    background-color: rgba($selected-color, 0.3);
  }
}
.selected {
  background-color: $selected-color;
  color: #fff;
}
</style>