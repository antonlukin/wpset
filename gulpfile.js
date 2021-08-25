const gulp = require('gulp');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

gulp.task('css', (done) => {
  const postcss = require('gulp-postcss');

  gulp.src('./src/css/styles.css')
      .pipe(plumber())
      .pipe(postcss())
      .pipe(concat('styles.min.css'))
      .pipe(gulp.dest('./assets/'));

  done();
});

gulp.task('js', (done) => {
  const babel = require('gulp-babel');

  gulp.src('./src/js/*.js')
      .pipe(babel({
        presets: ['@babel/env'],
      }))
      .pipe(uglify())
      .pipe(concat('scripts.min.js'))
      .pipe(gulp.dest('./assets/'));

  done();
});

// Watch soruces and update styles and scripts
gulp.task('watch', (done) => {
  gulp.watch(['./src/**/*', './views/**/*'], gulp.parallel('css', 'js'));

  done();
});

// Build static files
gulp.task('build', gulp.parallel('css', 'js'));

// Build static files and watch changes by default.
gulp.task('serve', gulp.parallel('css', 'js', 'watch'));
