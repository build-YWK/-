const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 该配置可以解决打包后js文件夹中出现map文件的情况
  productionSourceMap: false,
  //关闭eslint校验工具
  lintOnSave: false,
  // 配置代理服务器 --- 解决跨域问题
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        // pathRewrite: {'/api': ''}
      }
    }
  }
})