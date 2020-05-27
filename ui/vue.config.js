module.exports = {
    devServer: {
      port: 8888,
      proxy: {
          '^/api/': {
            target: 'http://localhost:5000',
            changeOrigin: true
          }
      }
    }
  }