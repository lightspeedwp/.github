// Webpack config for {{theme_name}} block theme scaffold
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
  ...defaultConfig,
  entry: {
    'screen': './assets/scss/screen.scss',
    'editor': './assets/scss/editor.scss'
  },
  plugins: [
    ...(defaultConfig.plugins || []),
    new RemoveEmptyScriptsPlugin(),
  ]
};