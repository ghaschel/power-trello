const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

require.extensions['.header'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: 'css-loader',
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'userscript.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: require('./block.header'),
      raw: true,
      entryOnly: true
    })
  ]
}