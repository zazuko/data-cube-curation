module.exports = {
  roots: [
    '<rootDir>/lib',
  ],
  testRegex: '(test|spec)\\.tsx?$',
  transformIgnorePatterns: [
    'node_modules/(?!(@tpluscode/rdfine)/)',
  ],
}
