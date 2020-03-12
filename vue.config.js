const path = require("path")
const https = require("https")
const fs = require("fs")

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  chainWebpack: config => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"]
    types.forEach(type =>
      addStyleResource(config.module.rule("scss").oneOf(type))
    )
  },
  devServer: {
    host: `${process.env.VUE_APP_FRONT_HOST}`,
    port: `${process.env.VUE_APP_FRONT_PORT}`,
    disableHostCheck: true,
    https: {
      key: fs.readFileSync(path.join(__dirname, "./cert/private.key")),
      cert: fs.readFileSync(path.join(__dirname, "./cert/certificate.crt")),
      ca: fs.readFileSync(path.join(__dirname, "./cert/ca_bundle.crt"))
    },
    proxy: {
      "/apis": {
        target: `${process.env.VUE_APP_BACK_PATH}`,
        secure: true, //https
        changeOrigin: true,
        pathRewrite: {
          "^/apis": ""
        }
      }
    }
  }
}
// 全局导入scss文件
function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/styles/global.scss")]
    })
}
