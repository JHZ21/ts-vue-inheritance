import axios from "axios"

export { getUserInfo, postUserRegister, postUserLogin }

const basePath = `${process.env.VUE_APP_BASE_API}`

const postUserLogin = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/user/login`,
    data
  })

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
