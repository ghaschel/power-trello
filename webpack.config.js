const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = require('./general-config.js');

function getRules() {
  let rules = [];

  if (config.cssLoader) rules.push(config.cssLoaderConfig);
  if (config.tsLoader) rules.push(config.tsLoaderConfig);

  return rules;
}

function getPlugins() {
  let plugins =  [];

  if (config.uglifyWebpackConfig) plugins.push(new UglifyJSPlugin(config.uglifyWebpackConfig));
  if (config.bannerWebpack) plugins.push(new webpack.BannerPlugin(config.bannerWebpackConfig));

  return plugins;
}

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  name: 'PowerTrello',
  target: 'web',
  module: {
    rules: getRules()
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'userscript.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: getPlugins()
}