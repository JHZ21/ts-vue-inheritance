import axios from "axios"

export const getProjects = () =>
  axios({
    method: "GET",
    url: "/competition/getProjects"
  })

export const getProjectContent = (data: any) =>
  axios({
    method: "post",
    url: "/competition/getProjectContent/",
    data
  })
