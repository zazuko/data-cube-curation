module.exports = {
  presets: [
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        'decoratorsBeforeExport': true,
      },
    ],
    [
      '@babel/proposal-class-properties',
    ],
    '@babel/plugin-proposal-optional-chaining',
  ],
}
