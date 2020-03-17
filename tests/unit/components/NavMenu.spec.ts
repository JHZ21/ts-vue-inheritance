import jest from "jest"
import { shallowMount } from "@vue/test-utils"
import NavMenu from "@/components/NavMenu.vue"

var nav_data = [
  {
    label: "比赛:",
    aData: [
      "浙江省大学生多媒体作品设计竞赛",
      "中国大学生计算机设计大赛",
      `中国"互联网+"大学生创新创业大赛`,
      "国创",
      "新苗",
      "春萌"
    ]
  },
  {
    label: "时间:",
    aData: [
      [
        "2020上",
        "2019下",
        "2019上",
        "2018下",
        "2018上",
        "2017下",
        "2017上",
        "2016下",
        "2016上"
      ],
      [
        "2020上",
        "2019下",
        "2019上",
        "2018下",
        "2018上",
        "2017下",
        "2017上",
        "2016下",
        "2016上"
      ],
      [
        "2020上",
        "2019下",
        "2019上",
        "2018下",
        "2018上",
        "2017下",
        "2017上",
        "2016下",
        "2016上"
      ],
      [
        "2020上",
        "2019下",
        "2019上",
        "2018下",
        "2018上",
        "2017下",
        "2017上",
        "2016下",
        "2016上"
      ],
      [
        "2020上",
        "2019下",
        "2019上",
        "2018下",
        "2018上",
        "2017下",
        "2017上",
        "2016下",
        "2016上"
      ],
      [
        "2020上",
        "2019下",
        "2019上",
        "2018下",
        "2018上",
        "2017下",
        "2017上",
        "2016下",
        "2016上"
      ]
    ]
  }
]

describe("NavMenu.vue", () => {
  test("nav_itm click and emit update_selected_erea", async () => {
    var wrapper = shallowMount(NavMenu, {
      propsData: { nav_data }
    })
    const secondNavItem = wrapper.findAll(".nav_item:nth-of-type(2)").at(0)
    secondNavItem.trigger("click")
    // 很关键!
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted()["update_selected_erea"][0]).toEqual([[1, 0, 0]])
  })
})
