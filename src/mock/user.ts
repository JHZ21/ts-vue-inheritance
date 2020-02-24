import Mock from "mockjs"

Mock.mock("/user/info", "post", function(options: any) {
  // 根据 params 信息不同，返回各自用户信息
  const params: any = JSON.parse(options.body)
  const data = {
    user: {
      roles: ["a1", "tourist"]
      // roles: ["admin", "tourist"]
    }
  }
  return data
})
