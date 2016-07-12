var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    bower = require('gulp-bower'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps'),
    minify = require('gulp-minifier'),
    del = require('del'),
    gulpif = require('gulp-if'),
    argv = require('yargs').argv,
    inject = require('gulp-inject'),
    series = require('stream-series'),
    environments = require('gulp-environments');

var development = environments.development;
var production = environments.production;

var productionBuild = argv.production || argv.p || argv.prod || production();

var minifyOptions = {
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: false,
    minifyCSS: true
};

var files = {
    lib: [
        'bower_components/angular/angular.js',
        'bower_components/ng-tags-input/ng-tags-input.js'

    ],
    libMin: [
        'bower_components/angular/angular.min.js',
        'bower_components/ng-tags-input/ng-tags-input.min.js'
    ],
    app: [
        'client/scripts/app.js',
        'client/scripts/modules/**/*.js',
        'client/scripts/components/**/*.js',
        'client/scripts/services/**/*.js'
    ],
    index: [
        'client/*.*'
    ],
    templates: [
        'client/scripts/**/*.html'
    ],
    fonts: [
        'client/fonts/**',
        'client/stylesheets/fonts/**'
    ],
    images: [
        'client/images/**'
    ],
    data: [
        'client/scripts/data/**/*.json'
    ]
};

gulp.task('connect', function () {
    connect.server({
        root: ['public'],
        livereload: true
    });
});

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components'))
});

gulp.task('sass', function () {
    return sass('client/stylesheets/app.scss', {sourcemap: true})
        .on('error', sass.logError)
        .pipe(gulpif(!productionBuild, sourcemaps.write()))
        .pipe(gulpif(productionBuild, minify(minifyOptions)))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(livereload());
});

gulp.task('js:lib', function () {
    return gulp
        .src(gulpif(productionBuild, files.libMin, files.lib))
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('public/assets/js'))
        .pipe(livereload());
});

gulp.task('js:app', function () {
    return gulp
        .on('error', console.log)
        .src(files.app)
        .pipe(concat('app.js'))
        .pipe(gulpif(productionBuild, uglify({ mangle: true, compress:true, output: { beautify: false } })))
        .pipe(gulp.dest('public/assets/js'))
        .pipe(livereload());
});

gulp.task('index', function () {

    var sources = gulp.src(['public/assets/js/lib.js', 'public/assets/css/*.css'], {read: false});

    var appStream = gulp.src(['public/assets/js/app.js'], {read: false});

    return gulp
        .src(files.index)
        .pipe(inject(series(sources, appStream), {ignorePath: 'public/', addRootSlash: false}))
        .pipe(gulpif(productionBuild, minify(minifyOptions)))
        .pipe(gulp.dest('public'))
        .pipe(livereload());
});

gulp.task('templates', function () {
    return gulp
        .src(files.templates)
        .pipe(gulp.dest('public/assets/js'))
        .pipe(livereload());
});

gulp.task('fonts', function (cb) {
    return gulp
        .src(files.fonts)
        .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('images', function (cb) {
    return gulp
        .src(files.images)
        .pipe(gulp.dest('public/assets/images'))
        .pipe(livereload());
});

gulp.task('data', function () {
    return gulp
        .src(files.data)
        .pipe(gulp.dest('public/assets/js/data'));
});


gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('client/stylesheets/*.scss', gulp.parallel(['sass']));
    gulp.watch('client/stylesheets/**/*.scss', gulp.parallel(['sass']));
    gulp.watch('client/scripts/**/*.js', gulp.parallel(['js:app']));
    gulp.watch('client/scripts/**/*.html', gulp.parallel(['templates']));
    gulp.watch('client/index.html', gulp.parallel(['index']));
    gulp.watch('.start', function () {
        livereload.reload();
    });
});

gulp.task('clean', function () {
    return del(['public']);
});

gulp.task(
    'compile',
    gulp.series(
        'clean',
        gulp.parallel(
            'sass',
            'templates',
            'js:lib',
            'js:app',
            'fonts',
            'images',
            'data'
        ),
        'index'
    )
);

gulp.task('default',
    gulp.parallel(
        'connect',
        'compile',
        'watch'
    )
);
