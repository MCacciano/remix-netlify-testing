/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:prettier/recommended',
  ],
};
