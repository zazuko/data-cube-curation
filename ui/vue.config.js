module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/app' : '/',
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
