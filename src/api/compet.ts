import axios from "axios"

const basePath = `${process.env.VUE_APP_BASE_API}`

export const getProjects = () =>
  axios({
    method: "POST",
    url: `${basePath}/compet/getProjects`
  })

export const getNavData = (data: any) =>
  axios({
    method: "GET",
    url: `${basePath}/compet/getNavData`,
    data
  })

// export const getProjects = () =>
//   axios({
//     method: "GET",
//     url: "/competition/getProjects"
//   })

export const getProjectContent = (data: any) =>
  axios({
    method: "post",
    url: "/competition/getProjectContent/",
    data
  })
