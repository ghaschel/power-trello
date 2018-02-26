const fs = require('fs');

require.extensions['.header'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports = {
    cssLoader: true,
    cssLoaderConfig: {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'css-loader',
        options: { minimize: true }
    },
    tsLoader: true,
    tsLoaderConfig: {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
    },
    uglifyWebpack: true,
    uglifyWebpackConfig: {
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
    },
    bannerWebpack: true,
    bannerWebpackConfig: {
        banner: require('./block.header'),
        raw: true,
        entryOnly: true
    },
    compressImages: true
}