const gulp = require('gulp');
const fs = require('fs');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const sass = require('node-sass');
const sassDataURI = require('./src/util/base64.js'); //passar para ts

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
            sourceMap: true,
            outputStyle: 'expanded',
            functions: sassDataURI
        }, (err, result) => {
            if (!err) {
                if (!fs.existsSync('./src/css')){
                    fs.mkdirSync('./src/css');
                }

                fs.writeFile('./src/css/style.css', result.css, (err) => {
                    if (err) throw err;
                });

                fs.writeFile('./src/css/style.css.map', result.map, (err) => {
                    if (err) throw err;
                });
            } else {
                throw err;
            }
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
