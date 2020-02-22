<template>
  <div class="panel_content">
    <div class="nav_row"
      v-for="(nav_row, row_key) in nav_data"
      :key="row_key">
      <span class="nav_label">{{ nav_row.label }}</span>
      <div class="nav_items_wrapper">
        <div class="nav_item"
          v-for="(nav_item, item_key) in Array.isArray(nav_row.aData[0])
            ? nav_row.aData[selected_erea[0]]
            : nav_row.aData"
          :key="item_key"
          @click="select_item(row_key, item_key)"
          :class="{selected: selected_erea[row_key] === item_key}">
          {{ nav_item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from "vue-property-decorator"
import {NavRow} from "@/utils/interface.ts"

@Component({
  name: "NavMenu"
})
export default class extends Vue {
  @Prop({required: true}) nav_data!: NavRow[]
  selected_erea: number[] = [0, 0, 0]

  @Watch("selected_erea", {deep: true})
  emit_selected_erea(selected_erea: number[]) {
    this.$emit("update_selected_erea", selected_erea)
  }

  select_item(row_key: number, item_key: number) {
    Vue.set(this.selected_erea, row_key, item_key)
  }
}
</script>

<style lang="scss" scoped>
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
</style>
