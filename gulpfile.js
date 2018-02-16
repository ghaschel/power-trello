const gulp = require('gulp');
const fs = require('fs');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const sass = require('node-sass');
const sassDataURI = require('lib-sass-data-uri');

gulp.task('webpack', (done) => {
    return webpack(config).run((done) => {
        return (err, stats) => {
            if (err) {
                console.log('Error', err);
                if (done) {
                    done();
                }
            } else {
                Object.keys(stats.compilation.assets).forEach((key) => {
                    console.log('Webpack: output ' + key);
                });
                console.log('Webpack: finished ' + stats.compilation.name);
                if (done) {
                    done();
                }
            }
        };
    });
});

gulp.task('sass', () => {
    return (
        sass.render({
            file: './src/scss/_style.scss',
            outFile: './src/css/style.css',
            sourceMap: true,
            outputStyle: 'expanded',
            errLogToConsole: true,
            functions: Object.assign(sassDataURI, {other: function() {}})
        }, (err, result) => {
            if (!err) {
                fs.writeFile('./src/css/style.css', result.css, (err) => {
                    if (!err) return;
                    console.log(err);
                });

                fs.writeFile('./src/css/style.css.map', result.map, (err) => {
                    if (!err) return;
                    console.log(err);
                });
            }
            console.log(err);
        })
    );
});

gulp.task('default', () => {
    gulp.watch([
        'src/scss/**/*.scss'
    ], ['sass']);

    gulp.watch([
        'src/**/*.ts'
    ], ['webpack']);
});
