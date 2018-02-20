const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

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
    new UglifyJSPlugin({
      parallel: 4,
      sourceMap: true,
      uglifyOptions: {
        mangle: false,
        compress: false,
        output: {
          beautify: true,
          comments: false
        }
      }
    }),
    new webpack.BannerPlugin({
      banner: require('./block.header'),
      raw: true,
      entryOnly: true
    })
  ]
}