module.exports = {
  transpileDependencies: [
    'alcaeus',
    '@lit-any/core',
    '@lit-any/forms',
    '@hydrofoil/alcaeus-forms',
    'lit-element'
  ],
  chainWebpack: config => {
    config.module
      .rule('nq')
      .test(/\.nq$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
