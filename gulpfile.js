var gulp = require('gulp');
var del = require('del');
var minifySpace = require('./gulp-custom-plug/gulp-minify-space');

// gulp.task('default', function() {
//     gulp.src('src/*.html', { base: 'src' })
//         .pipe(minify({
//             ext: {
//                 src: '.html',
//                 min: '.html'
//             },
//             exclude: ['tasks'],
//             ignoreFiles: ['.combo.js', '-min.js']
//         }))
//         .pipe(gulp.dest('build'))
// })

gulp.task('default', function() {
  gulp.src('src/*.*', { base: 'src' })
    .pipe(minifySpace())
    .pipe(gulp.dest('build'));

  gulp.src('src/html/*.*', { base: 'src' })
    .pipe(minifySpace())
    .pipe(gulp.dest('build'));

  gulp.src('src/css/*.*', { base: 'src' })
    .pipe(minifySpace())
    .pipe(gulp.dest('build'));

  gulp.src('src/js/*.*', { base: 'src' })
    .pipe(minifySpace())
    .pipe(gulp.dest('build'));

  gulp.src('src/img/*.*', { base: 'src' })
    .pipe(minifySpace())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
  del(['build/'], cb)
});