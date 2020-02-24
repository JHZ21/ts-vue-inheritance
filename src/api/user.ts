import axios from "axios"

export { getUserInfo }

const getUserInfo = (data: any) =>
  axios({
    method: "post",
    url: "/user/info",
    data
  })
