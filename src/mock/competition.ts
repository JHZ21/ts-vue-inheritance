// import Mock from "mockjs"
// import axios from "axios"
// import { pipe, reapeatNToM } from "@/utils/func"
// import { StepDataType } from "@/utils/interface"

// const nav_data = [
//   {
//     label: "比赛:",
//     aData: [
//       "浙江省大学生多媒体作品设计竞赛",
//       "中国大学生计算机设计大赛",
//       `中国"互联网+"大学生创新创业大赛`,
//       "国创",
//       "新苗",
//       "春萌"
//     ]
//   },
//   {
//     label: "时间:",
//     aData: [
//       [
//         "2020上",
//         "2019下",
//         "2019上",
//         "2018下",
//         "2018上",
//         "2017下",
//         "2017上",
//         "2016下",
//         "2016上"
//       ],
//       [
//         "2020上",
//         "2019下",
//         "2019上",
//         "2018下",
//         "2018上",
//         "2017下",
//         "2017上",
//         "2016下",
//         "2016上"
//       ],
//       [
//         "2020上",
//         "2019下",
//         "2019上",
//         "2018下",
//         "2018上",
//         "2017下",
//         "2017上",
//         "2016下",
//         "2016上"
//       ],
//       [
//         "2020上",
//         "2019下",
//         "2019上",
//         "2018下",
//         "2018上",
//         "2017下",
//         "2017上",
//         "2016下",
//         "2016上"
//       ],
//       [
//         "2020上",
//         "2019下",
//         "2019上",
//         "2018下",
//         "2018上",
//         "2017下",
//         "2017上",
//         "2016下",
//         "2016上"
//       ],
//       [
//         "2020上",
//         "2019下",
//         "2019上",
//         "2018下",
//         "2018上",
//         "2017下",
//         "2017上",
//         "2016下",
//         "2016上"
//       ]
//     ]
//   }
// ]

// function createProject() {
//   return Mock.mock({
//     PName: "@csentence",
//     PSummary: "@cparagraph",
//     TName: "@csentence",
//     "TMembers|1-7": ["@cname"],
//     id: "@integer(10000, 99999)"
//   })
// }

// const createProjectsFunc: Function = (<Function>(
//   pipe(reapeatNToM(10), reapeatNToM(20), reapeatNToM(1, 20))
// ))(createProject)

// Mock.mock("/competition/getProjects", () => {
//   return {
//     allProjects: createProjectsFunc(),
//     nav_data
//   }
// })

// Mock.mock("/competition/getProjectContent/", function(options: any) {
//   if (options) {
//     let params: any = JSON.parse(options.body)
//     let project_id: number = params.project_id
//     // 更加project_id 返回相应的 porject data
//     let default_step_data: StepDataType = {
//       deadline: "2-21-2020",
//       description:
//         "这是一段很长很长很长的描述性文字。这是一段很长很长很长的描述性文字。"
//     }
//     let project_name = "大二房价将藕带"
//     let content_items = [
//       {
//         title: "项目简介",
//         content: [
//           "如题目所示，有一个数组 使用 v-for 循环遍历这个数组，进行渲染展示，当用户点击删除按钮的时候应对应的删除 相应的数组元素并且更新 dom",
//           "的Joe我都是摸底哦欸哦莫i恶魔"
//         ]
//       },
//       {
//         title: "技术栈",
//         content: ["Vue", "Vue-router"]
//       }
//     ]
//     let team = {
//       team_name: "的Jodi哦",
//       members: [
//         {
//           id: "a0",
//           portrait: require("@/assets/images/header_avator.gif"),
//           introduce: [
//             "江小白",
//             "2017级",
//             "Web前端攻城狮",
//             "熟悉Vue全家桶",
//             "熟悉SCSS",
//             "Web前端攻城狮",
//             "熟悉Vue全家桶",
//             "熟悉SCSS",
//             "Web前端攻城狮",
//             "熟悉Vue全家桶",
//             "熟悉SCSS"
//           ],
//           contribution: [
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法"
//           ]
//         },
//         {
//           id: "a1",
//           portrait: require("@/assets/images/header_avator.gif"),
//           introduce: [
//             "江小白",
//             "2017级",
//             "Web前端攻城狮",
//             "熟悉Vue全家桶",
//             "熟悉SCSS"
//           ],
//           contribution: [
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法"
//           ]
//         },
//         {
//           id: "a2",
//           portrait: require("@/assets/images/header_avator.gif"),
//           introduce: [
//             "江小白",
//             "2017级",
//             "Web前端攻城狮",
//             "熟悉Vue全家桶",
//             "熟悉SCSS"
//           ],
//           contribution: [
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法",
//             "打法的非法，阿飞，啊额，嗯阿发发的，大非法"
//           ]
//         }
//       ]
//     }
//     let steps_objs = [
//       {
//         plan_name: "前端",
//         power: false,
//         steps_data: Array(4).fill(default_step_data),
//         activeNum: 2,
//         id: "3810238",
//         master: "a0"
//       },
//       {
//         plan_name: "后端",
//         power: false,
//         steps_data: Array(5).fill(default_step_data),
//         activeNum: 3,
//         id: "329dje3",
//         master: "a1"
//       }
//     ]

//     return {
//       project_name,
//       content_items,
//       team,
//       steps_objs
//     }
//   } else {
//     return {}
//   }
// })
