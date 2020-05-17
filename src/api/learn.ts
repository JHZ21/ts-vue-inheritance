import axios from "axios"

const basePath = `${process.env.VUE_APP_BASE_API}`

export const addReadVolume = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/learn/addReadVolume`,
    data
  })

export const uploadLearnCard = (data: FormData) =>
  axios({
    method: "POST",
    url: `${basePath}/learn/uploadCard`,
    data
  })

export const getLearnContent = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/learn/getContent`,
    data
  })

export const getLearnRotationUrl = () =>
  axios({
    method: "GET",
    url: `${basePath}/learn/rotationUrl`
  })

export const getLearnNavData = () => {
  return axios({
    method: "GET",
    url: `${basePath}/learn/getNavData`
  })
}

export const getLearnCards = (data: any) => {
  return axios({
    method: "POST",
    url: `${basePath}/learn/getCards`,
    data
  })
}
export const deleteCard = (data: any) => {
  return axios({
    method: "POST",
    url: `${basePath}/learn/deleteCard`,
    data
  })
}
