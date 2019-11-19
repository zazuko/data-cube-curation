const webpack = require('webpack')

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

    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/vocab-\w+\.js$/)
      return options
    })
  },
  configureWebpack: {
    plugins: [
      new webpack.NamedChunksPlugin((chunk) => {
        const vocabModule = [...chunk._modules].find(m => /rdf-vocabularies\/ontologies$/.test(m.context))

        if (vocabModule) {
          const matchVocabName = vocabModule.id.match(/(\w+)\.nq$/)
          if (matchVocabName) {
            return 'vocab-' + matchVocabName[1]
          }
        }

        return chunk.name
      })
    ]
  }
}
