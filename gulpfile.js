'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const browserSync = require("browser-sync");
const uglify = require('gulp-uglify-es').default;
const reload = browserSync.reload;

const path = {
  build: {
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    favicon: 'dist/',
    fonts: 'dist/fonts/',
    assets: 'dist/vendors/',
    sw: 'dist/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    favicon: 'src/favicon/**/*.*',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    assets: 'src/assets/**/*.*',
    sw: 'src/*.js'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    assets: 'src/assets/**/*.*'
  },
  clean: './dist'
};

const config = {
  server: {
    baseDir: "./dist",
  },
  open: 'external',
  port: 7000,
  logPrefix: "wooder.dev"
};

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('sw:build', function () {
  gulp.src(path.src.sw)
    .pipe(gulp.dest(path.build.sw))
    .pipe(reload({stream: true}));
});

gulp.task('assets:build', function () {
  gulp.src(path.src.assets)
    .pipe(gulp.dest(path.build.assets))
    .pipe(reload({stream: true}));
});

gulp.task('favicon:build', function () {
  gulp.src(path.src.favicon)
    .pipe(gulp.dest(path.build.favicon))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer({
      browsers: ['last 4 versions']
    })) //Добавим вендорные префиксы
    .pipe(cssmin()) //Сожмем
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css)) //И в build
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img)) //И бросим в build
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
  'html:build',
  'assets:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build',
  'favicon:build',
  // 'sw:build'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('assets:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  // watch([path.watch.img], function(event, cb) {
  //   gulp.start('image:build');
  // });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('webserver', function () {
  browserSync.init(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
