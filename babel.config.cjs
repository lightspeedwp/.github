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
    plugins: ['@babel/plugin-transform-runtime'],
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
