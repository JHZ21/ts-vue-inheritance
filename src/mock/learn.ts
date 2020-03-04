import Mock from "mockjs"
import { NestedCardList, CommentInfoType } from "@/utils/interface"
import { pipe, reapeatNToM } from "@/utils/func"
import { oContentUrlType } from "@/store/modules/learn.ts"

// import "./uploadLearn"

const nav_data = [
  {
    label: "方向:",
    aData: ["前端", "后端", "数据库", "计算机原理", "移动端", "大数据"]
  },
  {
    label: "分类:",
    aData: [
      [
        "HTML/CSS",
        "JavaScript",
        "Vue.js",
        "React.js",
        "Angular.js",
        "Node.js",
        "jQuery",
        "Boostrap",
        "Sass/Less",
        "WebApp",
        "小程序",
        "前端工具",
        "Html5",
        "CSS3",
        "WebApp",
        "小程序",
        "前端工具",
        "Html5",
        "CSS3"
      ],
      ["后端"],
      ["数据库"],
      ["计算机原理"],
      ["移动端"],
      ["大数据"]
    ]
  },
  {
    label: "级别:",
    aData: ["入门", "初级", "中级", "高级"]
  }
]

function makeCard() {
  return Mock.mock({
    "img_url|1": [
      `url( ${require("@/assets/learn/rotation/rotation_01.jpg")} )`,
      `url( ${require("@/assets/learn/rotation/rotation_02.jpg")} )`,
      `url( ${require("@/assets/learn/rotation/rotation_03.jpg")} )`
    ],
    "label_0|0-10": 0,
    "label_1|0-20": 0,
    "label_2|0-10": 0,
    title: "@csentence",
    "readVolume|1-9999": 1,
    "id|1": [1111, 2222, 3333],
    uploader: "@cname",
    "timeStamp|1420041600000-1580290879259": 1420041600000
  })
}

const makeArrayRepeatFunc: Function | any[] = pipe(
  reapeatNToM(6),
  reapeatNToM(20),
  reapeatNToM(4),
  reapeatNToM(1, 70)
)

const allCardList: NestedCardList = (<Function>makeArrayRepeatFunc)(makeCard)()

Mock.mock("learn/card", "get", function() {
  const ret_val = {
    rotation_img_urls: [
      require("@/assets/learn/rotation/rotation_01.jpg"),
      require("@/assets/learn/rotation/rotation_02.jpg"),
      require("@/assets/learn/rotation/rotation_03.jpg")
    ],
    nav_data,
    allCardList
  }
  return ret_val
})

const OContentUrl: oContentUrlType = {
  "3333": "https://www.baidu.com/",
  "1111": "https://www.tslang.cn/docs/handbook/interfaces.html",
  "2222": "http://www.typescriptlang.org/docs/handbook/basic-types.html"
}
Mock.mock("learn/getocententurl", "post", function() {
  return OContentUrl
})

const comment_infos: CommentInfoType[] = [
  {
    portraitUrl: require("@/assets/images/header_avator.gif"),
    username: "aadsf",
    content: "新年快乐",
    timeStamp: 1580479254959
  },
  {
    portraitUrl: require("@/assets/images/header_avator.gif"),
    username: "aadsf",
    content: "新年快乐，遵在家里为社会做贡献，快发霉了~",
    timeStamp: 1580313600000
  },
  {
    portraitUrl: require("@/assets/images/header_avator.gif"),
    username: "aadsf",
    content:
      "新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~",
    timeStamp: 1577635200000
  },
  {
    portraitUrl: require("@/assets/images/header_avator.gif"),
    username: "aadsf",
    content:
      "新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~ 新年快乐，遵在家里为社会做贡献，快发霉了~",
    timeStamp: 1500479154959
  }
]
Mock.mock("/learn/getContent", "post", function(options: any) {
  if (options && options.body) {
    let params = JSON.parse(options.body)
    let content_url = OContentUrl[params.content_id]
    if (content_url) {
      return {
        content_url,
        comment_infos
      }
    }
  }
  return {}
})
