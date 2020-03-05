import axios from "axios"

export const getLearnContent = (data: any) =>
  axios({
    method: "POST",
    url: `${process.env.VUE_APP_BASE_API}/learn/getContent`,
    data
  })

export const getLearnRotationUrl = () =>
  axios({
    method: "GET",
    url: `${process.env.VUE_APP_BASE_API}/learn/rotationUrl`
  })

export const getLearnNavData = () => {
  return axios({
    method: "GET",
    url: `${process.env.VUE_APP_BASE_API}/learn/getNavData`
  })
}

export const getLearnCards = (data: any) => {
  return axios({
    method: "POST",
    url: `${process.env.VUE_APP_BASE_API}/learn/getCards`,
    data
  })
}
