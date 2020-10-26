const gulp = require('gulp');
const { series } = require('gulp');

const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');

const browserSync = require('browser-sync').create();

gulp.task('compile:scss', function() {
  return gulp.src('src/styles/**/*.scss')
             .pipe(sass())
             .pipe(autoprefixer({
                  overrideBrowserslist: ['last 2 versions'],
                  cascade: false
              }))
             .pipe(cleanCSS({compatibility: 'ie8'}))
             .pipe(gulp.dest('dist/styles'))
             .pipe(browserSync.stream())
});

gulp.task('clean:dist', function() {
  return del(['dist']);
})

gulp.task('compile:views', function() {
  return gulp.src('src/templates/*.pug')
             .pipe(pug({
               pretty: true
             }))
             .pipe(gulp.dest('dist/'))
});

gulp.task('build', series('clean:dist', 'compile:scss', 'compile:views'));

gulp.task('default', function() {
  gulp.watch('src/**/*/*.pug', series('compile:views'))
  gulp.watch('src/styles/**/*.scss', series('compile:scss'))
  gulp.watch('dist/*.html').on('change', browserSync.reload);
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
});


