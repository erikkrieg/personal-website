/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import eslint from 'gulp-eslint';
import del from 'del';
import autoprefixer from 'gulp-autoprefixer';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const paths = {
    assets: 'assets',
    dist: 'dist',
};
const jsPaths = {
    source: `${paths.assets}/src/**/*.js`,
    entry: `${paths.assets}/src/entry.js`,
    dist: `${paths.dist}/src`,
    distBundle: `${paths.dist}/src/main-bundle.js?(.map)`,
    gulpfile: 'gulpfile.babel.js',
    webpackfile: 'webpack.config.babel.js',

};
const sassPaths = {
    source: `${paths.assets}/scss/**/*.scss`,
    dist: `${paths.dist}/css`,
};


// SCSS
gulp.task('sass', () =>
    gulp.src(sassPaths.source)
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(gulp.dest(sassPaths.dist))
);


// JavaScript
gulp.task('js:lint', () =>
    gulp.src([
        jsPaths.source,
        jsPaths.gulpfile,
        jsPaths.webpackfile,
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

gulp.task('js:clean', () =>
    del([
        jsPaths.distBundle,
    ])
);

gulp.task('js:main', ['js:lint', 'js:clean'], () =>
  gulp.src(jsPaths.entry)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(jsPaths.dist))
);


// General
gulp.task('watch', () => {
    gulp.watch(jsPaths.source, ['js:main']);
    gulp.watch(sassPaths.source, ['sass']);
});

gulp.task('default', ['watch', 'js:main', 'sass']);
