import 'dotenv/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

const ignoreFolders = process.env.ESLINT_IGNORE
    ? process.env.ESLINT_IGNORE.split(',')
    : [
          'node_modules/**',
          'build/**',
          'dist/**',
          'coverage/**',
          'playwright-report/**',
          'test-results/**',
          'vendor/**',
          '.next/**',
          'logs/**',
          'scripts/utility/__tests__/**',
      ];

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
        ignores: ignoreFolders,
        plugins: { prettier },
        rules: {
            'prettier/prettier': 'warn',
        },
    },
];
