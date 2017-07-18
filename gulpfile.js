var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    webserver = require('gulp-webserver'),
    inject = require('gulp-inject'),
    hash = require('gulp-hash'),
    uglify = require('gulp-uglify'),
    order = require('gulp-order'),
    s3   = require('gulp-s3')


// If you want details of the error in the console
function swallowError (error) {
  gutil.log("ERROR")
  gutil.log(error.toString())
  this.emit('end')
}

gulp.task('default', ['build-css', 'build-js', 'inject', 'webserver', 'watch']);

// Watch JS hints
gulp.task('jshint', function() {
  return gulp.src('source/javascript/**/*.js')
            .pipe(jshint({ esversion: 6 }))
            .pipe(jshint.reporter('jshint-stylish'));
});

// Build the JS
gulp.task('build-js', function() {
  return gulp.src(['source/javascript/**/*.js'])
          .pipe(plumber())
          .pipe(sourcemaps.init())
          .pipe(order([
            'source/javascript/classes/**/*.js',
            'source/javascript/classes/*.js',
            'source/javascript/app.js',
          ], { base: './' }))
          .pipe(babel({ presets: ['es2015'] }))
          .pipe(concat('bundle.js'))
          .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
          // .pipe(uglify())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('public/assets/javascript'));
})

// Watch SASS Files
gulp.task('build-css', function() {
  var sassStream = sass();


  return gulp.src('source/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass()) // Add the map to modified source.
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/stylesheets'));
});

// Webservice
gulp.task('webserver', function() {
  gulp.src(['app', 'public/assets'])
    .pipe(webserver({
      // livereload: true,
    }));
});

// Inject
gulp.task('inject', function () {

  var opts = {
    algorithm: 'sha1',
    hashLength: 40,
    template: '<%= name %><%= ext %>?hash=<%= hash %>'
  }

  var target = gulp.src('source/html/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['public/assets/javascript/**/*.js',
                          'public/assets/stylesheets/**/*.css',
                          'public/assets/javascript/*.js',
                          'public/assets/stylesheets/*.css'], {read: false})
                          .pipe(order([
                            'public/assets/javascript/vendor/jquery.min.js',
                            'public/assets/javascript/vendor/**/*.js',
                            'public/assets/javascript/**/*.js',
                            'public/assets/stylesheets/vendor/**/*.css',
                            'public/assets/javascript/*.js',
                            'public/assets/stylesheets/*.css'
                          ], { base: './' }))
                      .pipe(hash(opts));

  return target.pipe(inject(sources, { ignorePath: 'public/assets' }))
    .pipe(gulp.dest('app'));
});


gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['build-js', 'jshint']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);
  gulp.watch('source/**', ['inject']);
});

gulp.task('publish', ['build-css', 'build-js', 'inject', 'prepare-export', 'export']);
gulp.task('prepare-export', function() {
  gulp.src('app/index.html')
    .pipe(gulp.dest('dist'));
  gulp.src(['public/assets/javascript/**/*.js',
            'public/assets/javascript/*.js'])
      .pipe(gulp.dest('dist/javascript'));

  gulp.src(['public/assets/stylesheets/**/*'])
      .pipe(gulp.dest('dist/stylesheets'));

  gulp.src(['public/assets/stylesheets/**/*'])
      .pipe(gulp.dest('dist/stylesheets'));

      gulp.src(['public/assets/data/**/*'])
          .pipe(gulp.dest('dist/data'));
});

gulp.task('export', function() {
  var AWS = {
    "key":    process.env.AWS_ACCESS_KEY,
    "secret": process.env.AWS_SECRET_KEY,
    "bucket": process.env.AWS_BUCKET_NAME,
    "region": process.env.AWS_REGION
  }

  gulp.src('./dist/**').pipe(s3(AWS));

})
