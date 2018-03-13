const gulp          = require('gulp');
const fs            = require('fs');
const webpack       = require('webpack');
const config        = require('./general-config.js');
const webpackConfig = require('./webpack.config.js');
const sass          = require('node-sass');
const ts            = require("typescript");
const del           = require('del');
const sassDataURI   = eval(ts.transpile(fs.readFileSync("./src/util/base64.ts").toString()));
const imagemin      = require('imagemin');
const jpegTran      = require('imagemin-jpegtran');
const pngquant      = require('imagemin-pngquant');


gulp.task('webpack', (done) => {
    return webpack(webpackConfig).run((err, stats) => {
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
    });
});

gulp.task('imagemin', (done) => {
    imagemin(['assets/*.{jpg,png}'], 'assets', {
        plugins: [
            jpegTran({ progressive: true, arithmetic: true }),
            pngquant({quality: '65-80', speed: 1})
        ]
    }).then(files => {
        done();
        // console.log(files);
    });
});

gulp.task('sass', () => {
    return ( new Promise((resolve, reject) => {
        sass.render({
            file: './src/scss/_style.scss',
            outFile: './src/css/style.css',
            sourceMap: './src/css/style.css.map',
            sourceComment: 'normal',
            outputStyle: 'expanded',
            omitSourceMapUrl: false,
            functions: sassDataURI.getFunctions()
        }, (err, result) => {
            if (!err) {
                if (!fs.existsSync('./src/css')){
                    fs.mkdirSync('./src/css');
                }

                fs.writeFile('./src/css/style.css', result.css, (err) => {
                    if (err){
                        reject(err);
                    } else {
                        resolve()
                    }
                });

                fs.writeFile('./src/css/style.css.map', result.map, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(err);
            }
        });
    }))
        
});

gulp.task('clean', (done) => {
    del(['dist', 'src/css', 'package-lock.json']).then(()=> {
        done()
    });
});

gulp.task('build', gulp.series('clean', 'imagemin', 'sass', 'webpack'));

gulp.task('default', () => {
    gulp.watch([
        'src/scss/**/*.scss'
    ], ['sass']);

    gulp.watch([
        'src/**/*.ts'
    ], ['webpack']);
});
