'use strict';

// Require what we need
var browserSync = require('browser-sync'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    tmplCache = require('gulp-angular-templatecache'),
    change = require('gulp-change'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    consolidate = require('gulp-consolidate'),
    filter = require('gulp-filter'),
    flatten = require('gulp-flatten'),
    gulpIf = require('gulp-if'),
    inject = require('gulp-inject'),
    less = require('gulp-less'),
    minifyHtml = require('gulp-htmlmin'),
    minifyCss = require('gulp-clean-css'),
    order = require('gulp-order'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    httpProxy = require('http-proxy'),
    glob = require('glob'),
    runSequence = require('run-sequence'),
    wiredep = require('wiredep'),
    argv = require('yargs').argv,

    // Some gulp config values
    hygieia = {
        src: 'src/',
        dist: 'dist/'
    },

    // List of where our js files come from
    jsFiles = [
        'src/{app,components}/**/*.js'
    ],

    // List of theme files for less processing
    themeFiles = [
        'src/components/themes/*.less'
    ],

    // Look for html files
    viewFiles = [
        'src/{app,components}/**/*.html'
    ],

    widgetStyleFiles = [
        'src/{app,components}/**/*.less'
    ],

    // look for local json files
    testDataFiles = [
        'src/test-data/*'
    ],

    // config values that will be written to the UI and can
    // be overwritten by arguments during the build process.
    // if left null, they will not be written to the file
    config = {
        module: 'hygieia-dashboard',
        local: null,
        api: null,
        refresh: 60
    };

// override config values
for(var field in config) {
    var val = argv[field];
    if(val) {
        if(val == 'true' || val == 'false') {
            val = val !== 'false';
        }
        config[field] = val;
    }

    if(config[field] === null) {
        delete config[field];
    }
}

/*******************************
 * MAIN TASKS
 *******************************/
gulp.task('default', ['build']);

// moves everything to the build folder
gulp.task('build', function(callback) {
    runSequence('clean', ['assets', 'themes', 'fonts', 'js', 'views', 'test-data'], 'html', callback);
});

// run the build task, start up a browser, then
// watch the different file locations and execute
// the relevant tasks
gulp.task('serve', ['build'], function() {
    /*
     * Location of your backend server
     */
    var proxyTarget = config.api || 'http://localhost:8080';

    var proxy = httpProxy.createProxyServer({
        target: proxyTarget
    });

    proxy.on('error', function(error, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });

        console.error(chalk.red('[Proxy]'), error);
    });

    /*
     * The proxy middleware is an Express middleware added to BrowserSync to
     * handle backend request and proxy them to your backend.
     */
    function proxyMiddleware(req, res, next) {
        /*
         * Proxy the REST API.
         */
        if (/^\/api\/.*/.test(req.url)) {
            proxy.web(req, res);
        } else {
            next();
        }
    }

    browserSync.init({
        server: {
            baseDir: hygieia.dist,
            startPath: '/',
            middleware: [proxyMiddleware]
        }
    });

    gulp.watch(jsFiles).on('change', function() {
        runSequence(['js','html'], browserSync.reload);
    });

    // watch the less files in addition to the themes
    gulp.watch(themeFiles.concat(widgetStyleFiles)).on('change', function() {
        runSequence('themes', browserSync.reload);
    });

    gulp.watch(viewFiles).on('change', function() {
        runSequence('views', browserSync.reload)
    });

    gulp.watch(testDataFiles).on('change', function() {
        runSequence('test-data');
    });
});
