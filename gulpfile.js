const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const awsPublish = require('gulp-awspublish');
const clean = require('gulp-clean');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const runSeq = require('run-sequence');

const headers = {
  'Cache-Control': 'max-age=315360000, no-transform, public'
};

const IMAGES = 'src/images/*';
const CSS = 'src/css/**/*.css';
const HTML = 'src/**/*.html';
const BUILD = 'build';

const cleanBuild = () => {
  return gulp.src(`${BUILD}/**/*`, { read: false })
    .pipe(clean());
}

const buildImages = () => {
  return gulp.src(IMAGES)
    .pipe(imagemin([imagemin.jpegtran({ progressive: true })]))
    .pipe(awsPublish.gzip())
		.pipe(gulp.dest(`${BUILD}/images`))
};

const buildCSS = () => {
  return gulp.src(CSS)
    .pipe(cleanCSS())
    .pipe(awsPublish.gzip())
    .pipe(gulp.dest(BUILD + '/css'));
};

const buildHTML = () => {
  return gulp.src(HTML)
    .pipe(htmlmin({
      minifyJS: true,
      collapseWhitespace: true,
    }))
    .pipe(awsPublish.gzip())
    .pipe(gulp.dest(BUILD));
};

gulp.task('cleanBuild', cleanBuild);
gulp.task('buildImages', buildImages);
gulp.task('buildCSS', buildCSS);
gulp.task('buildHTML', buildHTML);
gulp.task('build', done => {
  return runSeq('cleanBuild', ['buildImages', 'buildCSS', 'buildHTML'], done);
});

