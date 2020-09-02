module.exports = {
  roots: ['<rootDir>'],
  testRegex: '(test|spec)\\.tsx?$',
  transformIgnorePatterns: [
    'node_modules/(?!(@tpluscode/rdfine)/)',
  ],
  moduleNameMapper: {
    '@rdf-esm/(.*)': '@rdfjs/$1',
  },
}
