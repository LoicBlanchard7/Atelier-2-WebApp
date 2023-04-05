const { defineConfig } = require('@vue/cli-service')
  module.exports = 
  defineConfig(
    {
      
      transpileDependencies: true,
      publicPath: '/www/leblanc71u/atelier2',
      devServer: {
        proxy: {
          '/': {
            target: "http://www-cache:3128",
            changeOrigin: true, 
            pathRewrite: {
              '/': '' 
            }
          }
        }
      }
    }
  )
