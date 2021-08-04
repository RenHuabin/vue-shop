const path = require('path')

module.exports = {
  configureWebpack: { // 覆盖 webpack 的配置项
    resolve: { // 配置别名
      alias: {
        '@': path.resolve(__dirname, './src'),
        // '@api': path.resolve(__dirname, './src/api'),
        '@components': path.resolve(__dirname, './src/components'),
        // '@utils': path.resolve(__dirname, './src/utils'),
        '@views': path.resolve(__dirname, './src/views'),
        // '@common': path.resolve(__dirname, './src/common'),
        '@assets': path.resolve(__dirname, './src/assets')
      }
    }
  },
  devServer: {
    hot: true
  }
}
