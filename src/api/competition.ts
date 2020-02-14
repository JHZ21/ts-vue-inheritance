import axios from "axios"

export const getProjects = () =>
  axios({
    method: "GET",
    url: "/competition/getProjects"
  })
