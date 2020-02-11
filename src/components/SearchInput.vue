<template>
  <div class="search_wrapper" :class="[mode]">
    <input
      class="search_input"
      type="text"
      :placeholder="placeholder"
      v-model="search_input_val"
      @keyup.enter.exact="emit_search_val"
    />
    <div class="search_icon_wrapper">
      <i class="iconfont icon-icon-test" @click="emit_search_val"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: ""
})
export default class extends Vue {
  @Prop({ required: false, default: "enter" }) placeholder!: string;
  @Prop({ required: false, default: "normal" }) mode!: "normal" | "big";
  search_input_val: string = "";
  emit_search_val() {
    console.log("emit", this.search_input_val);
    this.$emit("set_search_val", this.search_input_val);
  }
}
</script>

<style lang="scss" scoped>
$blue: rgba(87, 90, 138, 0.8);
.search_wrapper {
  // float: right;
  // padding-right: 40px;
  display: flex;
  margin: 12px 0;
  width: 466px;
  // width: px2rem(466);
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
  &.big {
    border-radius: 0;
    border: 1px solid $blue;
    background: #fff;
    @media screen and (max-width: 1479px) {
      & {
        width: 466px;
      }
    }
    .search_icon_wrapper {
      .iconfont {
        color: $blue;
      }
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
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
    .iconfont {
      font-size: 24px;
    }
  }
}
</style>
