import globals from 'globals'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      // Tell ESLint this is Node/CommonJS code
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: { ...globals.node }, // enables require, module, process, console, __dirname, etc.
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Style
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],

      // Best practices
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],

      // Dev ergonomics
      'no-console': 'off',

      // Allow unused params that start with _
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/**'],
  },
]
