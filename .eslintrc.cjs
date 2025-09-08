module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: null,
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    complexity: ['error', { max: 8 }],
    'max-lines-per-function': ['error', { max: 60, skipComments: true, skipBlankLines: true }],
  },
  ignorePatterns: ['dist', 'node_modules'],
};


