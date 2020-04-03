module.exports = {
  presets: [
    [
      '@babel/env',
      {
        'targets': {
          'node': 'current',
        },
      },
    ],
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
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
  ],
}
