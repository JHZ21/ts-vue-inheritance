<template>
  <div class="nav_menu">
    <div class="nav_row"
      v-for="(navRow, rowIndex) in navData"
      :key="navRow.label">
      <span class="nav_label">{{ navRow.label }}</span>
      <div class="nav_items_wrapper">
        <div class="nav_item"
          v-for="(item) in Array.isArray(navRow.aData)
            ? navRow.aData
            : navRow.aData[aSelected[0]]"
          :key="item.id"
          @click="select_item(rowIndex, item.id)"
          :class="{selected: aSelected[rowIndex] === item.id}">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator"
import { NavRow, ASelectedType } from "@/utils/interface.ts"
// LearnNavData
const data1: any = {
  index: 0,
  label: "方向:",
  aData: [
    { id: "fontEnd", text: "前端" },
    { id: "backEnd", text: "后端" },
    { id: "dataBase", text: "数据库" },
    { id: "principlesOfComputer", text: "计算机原理" },
  ],
}
const data2: any = {
  index: 1,
  label: "分类: ",
  aData: {
    fontEnd: [
      { id: "HTML/CSS", text: "HTML/CSS" },
      { id: "JavaScript", text: "JavaScript" },
      { id: "Vue.js", text: "Vue.js" },
      { id: "Sass/Less", text: "Sass/Less" },
    ],
    backEnd: [{ id: "a", text: "a" }],
    dataBase: [{ id: "a", text: "a" }],
    principlesOfComputer: [{ id: "a", text: "a" }],
  },
}
const data3: any = {
  index: 2,
  label: "级别:",
  aData: [
    { id: "junior", text: "初级" },
    { id: "intermediate", text: "中级" },
    { id: "senior", text: "高级" },
  ],
}
// competNavData
const competNavData1 = {
  label: "比赛:",
  aData: [
    {
      id: "dmtds.zjnu.edu.cn",
      text: "浙江省大学生多媒体作品设计竞赛",
    },
    {
      id: "jsjds.ruc.edu.cn",
      text: "中国大学生计算机设计大赛",
    },
    {
      id: "cy.ncss.cn",
      text: "中国'互联网+'大学生创新创业大赛",
    },
    {
      id: "gjcxcy.bjtu.edu.cn",
      text: "国创",
    },
    {
      id: "hsqn.zust.edu.cn",
      text: "新苗",
    },
    {
      id: "chunmeng",
      text: "春萌",
    },
  ],
}
const competNavData2 = {
  label: "时间:",
  aData: {
    "dmtds.zjnu.edu.cn": [
      {
        id: "2021.1",
        text: "2021上",
      },
      {
        id: "2020.7",
        text: "2020下",
      },
      {
        id: "2020.1",
        text: "2020上",
      },
      {
        id: "2019.7",
        text: "2019下",
      },
      {
        id: "2019.1",
        text: "2019上",
      },
      {
        id: "2018.7",
        text: "2018下",
      },
      {
        id: "2018.1",
        text: "2018上",
      },
      {
        id: "2017.7",
        text: "2017下",
      },
      {
        id: "2017.1",
        text: "2017上",
      },
    ],
    "jsjds.ruc.edu.cn": [
      {
        id: "2021.1",
        text: "2021上",
      },
      {
        id: "2020.7",
        text: "2020下",
      },
      {
        id: "2020.1",
        text: "2020上",
      },
      {
        id: "2019.7",
        text: "2019下",
      },
      {
        id: "2019.1",
        text: "2019上",
      },
      {
        id: "2018.7",
        text: "2018下",
      },
      {
        id: "2018.1",
        text: "2018上",
      },
      {
        id: "2017.7",
        text: "2017下",
      },
      {
        id: "2017.1",
        text: "2017上",
      },
    ],
    "cy.ncss.cn": [
      {
        id: "2021.1",
        text: "2021上",
      },
      {
        id: "2020.7",
        text: "2020下",
      },
      {
        id: "2020.1",
        text: "2020上",
      },
      {
        id: "2019.7",
        text: "2019下",
      },
      {
        id: "2019.1",
        text: "2019上",
      },
      {
        id: "2018.7",
        text: "2018下",
      },
      {
        id: "2018.1",
        text: "2018上",
      },
      {
        id: "2017.7",
        text: "2017下",
      },
      {
        id: "2017.1",
        text: "2017上",
      },
    ],
    "gjcxcy.bjtu.edu.cn": [
      {
        id: "2021.1",
        text: "2021上",
      },
      {
        id: "2020.7",
        text: "2020下",
      },
      {
        id: "2020.1",
        text: "2020上",
      },
      {
        id: "2019.7",
        text: "2019下",
      },
      {
        id: "2019.1",
        text: "2019上",
      },
      {
        id: "2018.7",
        text: "2018下",
      },
      {
        id: "2018.1",
        text: "2018上",
      },
      {
        id: "2017.7",
        text: "2017下",
      },
      {
        id: "2017.1",
        text: "2017上",
      },
    ],
    "hsqn.zust.edu.cn": [
      {
        id: "2021.1",
        text: "2021上",
      },
      {
        id: "2020.7",
        text: "2020下",
      },
      {
        id: "2020.1",
        text: "2020上",
      },
      {
        id: "2019.7",
        text: "2019下",
      },
      {
        id: "2019.1",
        text: "2019上",
      },
      {
        id: "2018.7",
        text: "2018下",
      },
      {
        id: "2018.1",
        text: "2018上",
      },
      {
        id: "2017.7",
        text: "2017下",
      },
      {
        id: "2017.1",
        text: "2017上",
      },
    ],
    chunmeng: [
      {
        id: "2021.1",
        text: "2021上",
      },
      {
        id: "2020.7",
        text: "2020下",
      },
      {
        id: "2020.1",
        text: "2020上",
      },
      {
        id: "2019.7",
        text: "2019下",
      },
      {
        id: "2019.1",
        text: "2019上",
      },
      {
        id: "2018.7",
        text: "2018下",
      },
      {
        id: "2018.1",
        text: "2018上",
      },
      {
        id: "2017.7",
        text: "2017下",
      },
      {
        id: "2017.1",
        text: "2017上",
      },
    ],
  },
}

@Component({
  name: "NavMenu",
})
export default class extends Vue {
  @Prop({ required: true }) navData!: NavRow[]
  // navData: NavRow[] = [data1, data2, data3]
  aSelected: ASelectedType = []
  oldSelected: string[] = []
  isEmit: boolean = true

  @Watch("aSelected", { deep: true })
  emit_selected_erea(aSelected: ASelectedType, oldSelected: ASelectedType) {
    if (oldSelected[0] !== aSelected[0]) {
      this.initASelected(aSelected[0])
    } else {
      this.updateSelectedErea(aSelected)
    }
  }
  @Watch("navData")
  onNavData(navData: NavRow[]) {
    if (navData) {
      this.initASelected()
    }
  }
  @Emit()
  updateSelectedErea(aSelected: ASelectedType) {}

  select_item(rowIndex: number, itemId: string) {
    // 浅拷贝，使得oldASeleted newASeleted 不同源
    const newASeleted: ASelectedType = [].concat([], this.aSelected as any)
    newASeleted[rowIndex] = itemId
    this.aSelected = newASeleted
    // Vue.set(this.aSelected, rowIndex, itemId)
  }
  initASelected(firstVal?: string) {
    const navData: NavRow[] = this.navData
    if (navData && navData[0] && navData[0].aData[0]) {
      const aSelected: ASelectedType = []
      navData.forEach((navRow, rowIndex) => {
        let itemId: string = ""
        if (rowIndex === 0 && firstVal) {
          itemId = firstVal
        } else if (Array.isArray(navRow.aData)) {
          itemId = navRow.aData[0].id
        } else {
          itemId = navRow.aData[aSelected[rowIndex - 1]][0].id
        }
        aSelected[rowIndex] = itemId
      })
      this.aSelected = aSelected
    }
  }
}
</script>

<style lang="scss" scoped>
.nav_menu {
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
          background-color: $selected-color;
          padding: 6px 10px;
          border-radius: 4px;
          color: #fff;
        }
      }
    }
  }
}
</style>
