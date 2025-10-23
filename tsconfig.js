// TypeScript config as JS file with dotenv support
require('dotenv').config();

/** @type {import('typescript').CompilerOptions} */
module.exports = {
    compilerOptions: {
        target: process.env.TS_TARGET || 'ES2020',
        module: process.env.TS_MODULE || 'ESNext',
        moduleResolution: process.env.TS_MODULE_RESOLUTION || 'Bundler',
        jsx: process.env.TS_JSX || 'react-jsx',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        noEmit: true,
    },
    include: [
        'src/**/*',
        'assets/**/*',
        'js/**/*',
        'scripts/**/*',
        '*.ts',
        '*.tsx',
    ],
    exclude: [
        'node_modules',
        'vendor',
        'build',
        'dist',
        '**/*.test.ts',
        '**/*.test.tsx',
    ],
};
