import axios from "axios"

export { getUserInfo, postUserRegister }

const basePath = `${process.env.VUE_APP_BASE_API}`

const postUserRegister = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/user/register`,
    data
  })

const getUserInfo = (data: any) =>
  axios({
    method: "post",
    url: "/user/info",
    data
  })
