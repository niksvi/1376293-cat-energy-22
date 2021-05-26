const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const csso = require('postcss-csso');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const svgsprite = require('gulp-svg-sprite');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();
const del = require('del');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const gcmq = require('gulp-group-css-media-queries');

//Clean

const clean = () => {
  return del('build');
}

// Svg stack

const svgstack = () => {
  del('build/img/stack.svg');
  return gulp.src('source/img/icons/**/*.svg')
    .pipe(plumber())
    .pipe(svgsprite({
      mode: {
        stack: {}
      }
    }))
    .pipe(rename('stack.svg'))
    .pipe(gulp.dest('build/img'));
}
exports.svgstack = svgstack;

// Copy

const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/*.ico',
    'source/manifest.webmanifest'
  ], {
    base: 'source'
  }).pipe(gulp.dest('build'));
}
exports.copy = copy;

//Copy images

const copyImages = () => {
  return gulp.src([
    'source/img/**/*.{jpg,png,svg}',
    '!source/img/icons/*'
  ])
    .pipe(gulp.dest('build/img'));
}
exports.copyImages = copyImages;

// Opimize images

const optimizeImages = () => {
  return gulp.src([
    'source/img/**/*.{jpg,png,svg}',
    '!source/img/icons/*'
  ])
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('build/img'));
}
exports.optimizeImages = optimizeImages;

// Create WebP

const createWebp = () => {
  return gulp.src([
    'source/img/**/*.{jpg,png}',
    '!source/img/favicons/*',
    '!source/img/common/map-pin.png'

  ])
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'));
}
exports.createWebp = createWebp;

// HTML minify

const html = () => {
  return gulp.src('source/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// HTML copy

const htmlCopy = () => {
  return gulp.src('source/**/*.html')
    .pipe(gulp.dest('build'));
}

// Dev styles

const devStyles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      postcssUrl({
        assetsPath: '../'
      }),
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}
exports.devStyles = devStyles;

// Production styles

const prodStyles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gcmq())
    .pipe(postcss([
      postcssUrl({
        assetsPath: '../'
      }),
      autoprefixer(),
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(postcss([
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}
exports.prodStyles = prodStyles;

// JS minify

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('build/js'))

}
exports.scripts = scripts;

const concatJs = () => {
  return gulp.src('source/js/concat/*.js')
    .pipe(concat('app.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}
exports.server = server;

//Reload

const reload = (done) => {
  sync.reload();
  done();
}
// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(devStyles));
  gulp.watch('source/img/icons/**/*.svg', gulp.series(svgstack, reload));
  gulp.watch('source/*.html', gulp.series(htmlCopy, reload));
  gulp.watch('source/js/**/*.js', gulp.series(scripts, concatJs, reload));
}

// Build

const build = gulp.series(
  clean,
  svgstack,
  gulp.parallel(
    copy,
    optimizeImages,
    createWebp,
    html,
    prodStyles,
    scripts,
    concatJs
  )
);
exports.build = build;

// Production test with server

const prodTest = gulp.series(
  clean,
  svgstack,
  gulp.parallel(
    copy,
    optimizeImages,
    createWebp,
    html,
    prodStyles,
    scripts,
    concatJs
  ),
  gulp.series(
    server,
    watcher
  )
);
exports.prodTest = prodTest;

//Default

exports.default = gulp.series(
  clean,
  svgstack,
  gulp.parallel(
    copy,
    copyImages,
    createWebp,
    htmlCopy,
    devStyles,
    scripts,
    concatJs
  ),
  gulp.series(
    server,
    watcher
  )
);
