import js from '@eslint/js';

export default [
  {
    ignores: [
      'node_modules/**',
      '.git/**',
      'coverage/**',
      'design_handoff_awesome_github/**',
      'website/**',
      '.github/website/**',
      '**/plugin-provided/**',
      '**/platform-managed/**',
      '**/directory-installed/**',
      '**/agentskills-main/**',
      '.jest-skip/**',
      '.claude/worktrees/**',
      '.remember/**',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        // Node.js
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __filename: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        // Browser API compatibility (Node.js 18+)
        URL: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
        // Jest
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        beforeAll: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
