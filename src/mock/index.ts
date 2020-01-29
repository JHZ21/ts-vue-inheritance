import Mock from "mockjs";
import axios from "axios";
import { CardData } from "@/utils/index";
import { partial, pipe } from "@/utils/func";

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
];

function makeCard() {
  return Mock.mock({
    "img_url|1": [
      `url( ${require("@/assets/learn/rotation/rotation_01.jpg")} )`,
      `url( ${require("@/assets/learn/rotation/rotation_02.jpg")} )`,
      `url( ${require("@/assets/learn/rotation/rotation_03.jpg")} )`
    ],
    title: "@csentence",
    "readVolume|1-9999": 1,
    href: "",
    uploader: "@cname",
    "date|1420041600000-1580290879259": 1420041600000
  });
}
function funcOfRepeatFunc(n: number, m: number, func: any): any {
  if (m === undefined) {
    m = n;
  }
  return function() {
    const return_val: any[] = [];
    let num = Math.floor(Math.random() * (m - n)) + n;
    for (; num--; ) {
      return_val.push(func());
    }
    return return_val;
  };
}

const catalog = [6, 20, 4];

const repeat4: any = partial(funcOfRepeatFunc, 4, undefined);
const repeat20: any = partial(funcOfRepeatFunc, 20, undefined);
const repeat6: any = partial(funcOfRepeatFunc, 6, undefined);
const repeat1_70: any = partial(funcOfRepeatFunc, 1, 70);
const makeArrayRepeatFunc: any = pipe(repeat6, repeat20, repeat4, repeat1_70);

const allCardList: CardData[][][][] = makeArrayRepeatFunc(makeCard)();

Mock.mock("learn/card", "get", function() {
  const ret_val = {
    nav_data,
    allCardList
  };
  return ret_val;
});
