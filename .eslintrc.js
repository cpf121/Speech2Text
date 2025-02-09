/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
