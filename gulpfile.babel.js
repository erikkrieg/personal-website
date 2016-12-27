/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import eslint from 'gulp-eslint';
import del from 'del';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const sync = browserSync.create();
const paths = {
    assets: 'assets',
    dist: 'dist',
};
const htmlPaths = {
    source: `${paths.assets}/pages/**/*.html`,
    dist: `${paths.dist}/`,
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


// Browser-sync
gulp.task('browser-sync', () => {
    const path = './dist/';
    sync.init({
        server: {
            baseDir: path,
        },
    });
    gulp.watch(`${path}*.html`).on('change', sync.reload);
});


// HTML
gulp.task('html', ['html:clean'], () =>
    gulp.src(htmlPaths.source)
        .pipe(gulp.dest(htmlPaths.dist))
);

gulp.task('html:clean', () =>
    del([
        `${htmlPaths.dist}**`,
        `!${paths.dist}`,
        `!${jsPaths.dist}`,
        `!${sassPaths.dist}`,
        `!${paths.dist}/img`,
    ])
);


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
        .pipe(sync.stream())
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
    gulp.watch(htmlPaths.source, ['html']);
});

gulp.task('default', ['watch', 'html', 'js:main', 'sass']);

gulp.task('sync', ['default', 'browser-sync']);
