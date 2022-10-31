module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['next', 'prettier', 'plugin:@typescript-eslint/recommended', 'react-app'],
  rules: {
    'no-console': 2,
    'react/react-in-jsx-scope': ['off'],
  },
  plugins: ['@typescript-eslint', 'prettier'],
};
