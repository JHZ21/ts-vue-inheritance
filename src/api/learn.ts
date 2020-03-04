import axios from "axios"

export const getLearnCard = () =>
  axios({
    method: "get",
    url: "learn/card"
  })

export const getOContentUrl = () =>
  axios({
    method: "POST",
    url: "learn/getocententurl"
  })

export const getContent = (data: any) =>
  axios({
    method: "POST",
    url: "/learn/getContent",
    data
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
