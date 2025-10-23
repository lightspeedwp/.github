require('dotenv').config();

module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-runtime',
    ],
    ignore: process.env.BABEL_IGNORE
        ? process.env.BABEL_IGNORE.split(',')
        : [
              'node_modules',
              'build',
              'dist',
              'coverage',
              'playwright-report',
              'test-results',
              'vendor',
              '.next',
              'logs',
          ],
};
