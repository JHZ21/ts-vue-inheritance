import Mock from "mockjs"
import { pipe, reapeatNToM } from "@/utils/func"

function createProject() {
  return Mock.mock({
    PName: "@csentence",
    PSummary: "@cparagraph",
    TName: "@csentence",
    "TMembers|1-7": ["@cname"],
    id: "@integer(10000, 99999)"
  })
}

const createProjectsFunc: Function = (<Function>(
  pipe(reapeatNToM(10), reapeatNToM(20), reapeatNToM(1, 20))
))(createProject)

Mock.mock("/competition/getProjects", createProjectsFunc)

// axios({
//   method: "GET",
//   url: "/competition/getProjects"
// }).then(res => {
//   console.log(res.data);
// });
// fetch("learn/getocententurl", {
//   method: "post"
// }).then(res => {
//   console.log(res);
//   console.log(res.json());
// })
