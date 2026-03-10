const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'no-console': 'off',
      'prettier/prettier': 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  prettier,
];
