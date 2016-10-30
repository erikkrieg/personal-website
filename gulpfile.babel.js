/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import gulp from 'gulp';
import sass from 'gulp-sass';
import eslint from 'gulp-eslint';
import del from 'del';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const paths = {
    dist: 'dist',
};
const jsPaths = {
    source: 'src/**/*.js',
    entry: 'src/entry.js',
    distBundle: `${paths.dist}/main-bundle.js?(.map)`,
    gulpfile: 'gulpfile.babel.js',
    webpackfile: 'webpack.config.babel.js',

};
const sassPaths = {
    source: 'styles/**/*.scss',
    dist: `${paths.dist}/styles`,
};


// SCSS
gulp.task('sass', () =>
    gulp.src(sassPaths.source)
        .pipe(sass().on('error', sass.logError))
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
    .pipe(gulp.dest(paths.dist))
);


// General
gulp.task('watch', () => {
    gulp.watch(jsPaths.source, ['js:main']);
    gulp.watch(sassPaths.source, ['sass']);
});

gulp.task('default', ['watch', 'js:main', 'sass']);
