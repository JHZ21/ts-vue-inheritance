import axios from "axios"

const basePath = `${process.env.VUE_APP_BASE_API}`

export const updatePName = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/compet/updatePName`,
    data
  })

export function updatePjContents(data: any) {
  return axios({
    method: "POST",
    url: `${basePath}/compet/updatePjContents`,
    data
  })
}

export const getProject = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/compet/getProject`,
    data
  })

export const uploadProject = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/compet/uploadProject`,
    data
  })

export const getProjectCards = (data: any) =>
  axios({
    method: "POST",
    url: `${basePath}/compet/getProjectCards`,
    data
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

// export const getProjectContent = (data: any) =>
//   axios({
//     method: "post",
//     url: "/competition/getProjectContent/",
//     data
//   })
