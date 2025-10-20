// ESLint v9 Flat Config (optional). Remove .eslintrc.* if using this.
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx,jsx}'],
    ignores: ['node_modules/**', 'build/**', 'dist/**'],
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
    }
  }
];
