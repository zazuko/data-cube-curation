module.exports = {
  transpileDependencies: ['alcaeus'],
  chainWebpack: config => {
    config.module
      .rule('nq')
      .test(/\.nq$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
