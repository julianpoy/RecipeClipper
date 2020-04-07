module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "one-var": 0,
    "one-var-declaration-per-line": ["error", "initializations"],
    "no-param-reassign": 0,
    "import/prefer-default-export": 0
  },
};
