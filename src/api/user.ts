import axios from "axios"

export { postUserRegister, postUserLogin, getUserInfo, userSignOut }

const basePath = `${process.env.VUE_APP_BASE_API}`

const userSignOut = () =>
  axios({
    method: "GET",
    url: `${basePath}/user/signOut`
  })

const getUserInfo = () =>
  axios({
    method: "POST",
    url: `${basePath}/user/getUserInfo`
  })

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

// const getUserInfo = (data: any) =>
//   axios({
//     method: "post",
//     url: "/user/info",
//     data
//   })
