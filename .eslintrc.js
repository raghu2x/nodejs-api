module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript'
    // '"plugin:@typescript-eslint/recommended"',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json'
  },
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/space-before-function-paren': 'off',

    // import rules
    'import/first': 'error',
    'import/newline-after-import': 'error'
  }
}
