module.exports = {
  'roots': [
    '<rootDir>/lib',
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  'transform': {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
