module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'standard',
    'prettier',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint', '@typescript-eslint', 'react-hooks'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'linebreak-style': 'off',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    camelcase: 'off',
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
