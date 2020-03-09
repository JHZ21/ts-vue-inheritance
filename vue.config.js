const path = require("path")

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  chainWebpack: config => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"]
    types.forEach(type =>
      addStyleResource(config.module.rule("scss").oneOf(type))
    )
  },
  devServer: {
    host: "inherit.proudmodest.cn",
    port: 80,
    disableHostCheck: true,
    proxy: {
      "/apis": {
        target: "http://localhost:3000",
        secure: false,
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
