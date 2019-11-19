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

    // Disable auto-prefetching because it was prefetching all the ontologies
    // of the rdf-vocabularies dependency.
    config.plugins.delete('prefetch')
  }
}
