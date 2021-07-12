module.exports = {
  roots: [
    '<rootDir>/lib',
  ],
  testRegex: '(test|spec)\\.tsx?$',
  transformIgnorePatterns: [
    'node_modules/(?!(@tpluscode)/)',
  ],
  moduleNameMapper: {
    '@rdf-esm/(.*)': '@rdfjs/$1',
  },
}
