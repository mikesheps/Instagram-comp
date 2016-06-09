// 'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import stylus from 'gulp-stylus';
import sourcemaps from 'gulp-sourcemaps';
import jade from 'gulp-jade';
import plumber from 'gulp-plumber';
import todo from 'gulp-todo';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

const defaultBrowser = 'google chrome canary';


const stylusPath = 'src/stylus/style.styl';
const jadePath = 'src/jade/*.jade';
const distPath = './dist';
const imgPath = 'src/img/**/*';

gulp.task('imgs', function () {
  return gulp.src(imgPath)
    .pipe(changed(distPath))
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(`${distPath}/img`))
});

browserSync.create();
// Static Server + watching scss/html files
gulp.task('serve', ['stylus', 'jade', 'imgs'], function() {
  browserSync.init({
    server: distPath,
    browser: defaultBrowser
  });

  gulp.watch(stylusPath, ['stylus']);
  gulp.watch(jadePath, ['jade']);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('stylus', function() {
  return gulp.src(stylusPath)
  	//.pipe(plumber())
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
  	.pipe(sourcemaps.init())
    .pipe(stylus({compress: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distPath))
    .pipe(browserSync.stream());
});

gulp.task('jade', function() {
  var YOUR_LOCALS = {
  	headings: {
      one: "Lookbook; a Shopify theme",
      two: "Deliberate Practice: Becoming a Design Grand Master",
    },
  	paragrphs: {
      one: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      two : "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  };

  gulp.src(jadePath)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(distPath))
});

// Default task to run
gulp.task('default', ['serve']);





////////////////
// Task: TODO //
////////////////

gulp.task('todo', () => {
 gulp.src([stylusPath, jadePath])
   .pipe(todo({
     customTags: ['NOTES']
   }))
   .pipe(gulp.dest('./'))
   // -> Will output a TODO.md with your todos
})
