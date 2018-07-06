var gulp = require('gulp'),//
    watch = require('gulp-watch'),//
    autoprefixer = require('gulp-autoprefixer'),//
    uglify = require('gulp-uglify'),//
    sass = require('gulp-sass'),//
    rename  = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano      = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),//
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'  
    },
    src: { 
        html: 'src/*.html', 
        js: 'src/js/index.js',
        style: 'src/styles/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "arx!m#d"
};

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
});

gulp.task('js:build', function () {
    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
         path.src.js])
        .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./', {
            sourceMappingURL: function (file) {
                return path.build.js.replace('./', '') + file.relative + '.map';
            }
        }))
        .pipe(gulp.dest(path.build.js)) 
});

gulp.task('style:build', function () {
    gulp.src([path.src.style])
        .pipe(sourcemaps.init())
        .pipe(sass({
            onError: browserSync.notify
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })) 
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./', {
            sourceMappingURL: function (file) {
                return path.build.css.replace('./', '') + file.relative + '.map';
            }
        }))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) 
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'image:build'
]);
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});
gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});
gulp.task('default', ['build','webserver','watch']);