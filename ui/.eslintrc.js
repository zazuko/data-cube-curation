module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Replace `no-unused-vars` with `@typescript-eslint/no-unused-vars`
    // because it raises false positives with `types` and `interfaces`
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      args: 'none'
    }]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
