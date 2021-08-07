const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');

gulp.task('css', (done) => {
  const postcss = require('gulp-postcss');

  gulp.src('./src/css/styles.css')
      .pipe(plumber())
      .pipe(postcss())
      .pipe(rename('styles.min.css'))
      .pipe(gulp.dest('./assets/'));

  done();
});

// Watch soruces and update styles and scripts
gulp.task('watch', (done) => {
  gulp.watch(['./src/**/*', './views/**/*'], gulp.parallel('css'));

  done();
});

// Build static files
gulp.task('build', gulp.parallel('css'));

// Build static files and watch changes by default.
gulp.task('serve', gulp.parallel('css', 'watch'));
