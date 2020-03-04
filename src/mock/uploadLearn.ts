import axios from "axios"
import Mock from "mockjs"
import { reapeatNToM } from "@/utils/func"

function makeUpCard() {
  return Mock.mock({
    "imgUrl|1": [
      `url( ${require("@/assets/learn/rotation/rotation_01.jpg")} )`,
      `url( ${require("@/assets/learn/rotation/rotation_02.jpg")} )`,
      `url( ${require("@/assets/learn/rotation/rotation_03.jpg")} )`
    ],
    "label_0|0-10": 0,
    "label_1|0-20": 0,
    "label_2|0-5": 0,
    title: "@csentence",
    "readVolume|1-9999": 1,
    "id|1": [1111, 2222, 3333],
    uploader: "@cname",
    "timeStamp|1420041600000-1580290879259": 1420041600000
  })
}
const uploadCardList = (<Function>reapeatNToM(30000, 60000))(makeUpCard)()
axios({
  url: "http://localhost:3000/learn/uploadCards",
  method: "POST",
  data: {
    allCardList: uploadCardList
  }
})
  .then(res => {
    console.log(res.data)
  })
  .catch(err => {
    console.log("err", err)
  })
