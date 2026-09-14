/**
 * Babel configuration shared across the repo.
 */
require('dotenv').config();

/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
    babelrc: false,
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-object-rest-spread',
        '@babel/plugin-transform-runtime',
        // import.meta parsing is native to Babel's parser since 7.8 and has
        // no @babel/plugin-syntax-import-meta release for Babel 8; the
        // plugin was a no-op even before removal.
    ],
    ignore: process.env.BABEL_IGNORE
        ? process.env.BABEL_IGNORE.split(',')
        : [
              'build',
              'dist',
              'coverage',
              'test-results',
              'vendor',
              '.next',
              'logs',
              'tmp',
              '.cache',
              '.husky',
              '.vercel',
              '.netlify',
              '.storybook',
              'docs/mustache-repo-templates',
          ],
};
