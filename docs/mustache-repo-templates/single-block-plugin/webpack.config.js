// Prefer @wordpress/scripts. This is a minimal fallback.
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      { test: /\.(js|ts|tsx)$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.s?css$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] },
    ]
  }
};
