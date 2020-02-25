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
