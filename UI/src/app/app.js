// Test to see if local storage is supported functionality
// Note: In the future, instead of writing this function ourselves, use Modernizr to detect
// support for HTML5 Storage (http://diveintohtml5.info/storage.html).
var localStorageSupported = (function () {
    try {
        localStorage.setItem('foo', 'bar');
        localStorage.removeItem('foo');
        return true;
    } catch (exception) {
        return false;
    }
})();

(function () {
    // Execute in strict mode, you can not use undeclared variables
    'use strict';

    // Set default theme
    var theme = 'dash';

    // Get theme from storage
    if(localStorageSupported) {
        var tempTheme = localStorage.getItem('theme');
        if(tempTheme && tempTheme != 'undefined') {
            theme = tempTheme;
        }
    }

    // <link>
    // Create link element and add the theme stylesheet in the header
    var link = document.createElement('link');
    // Unique id for this link document
    link.setAttribute('id', 'theme');
    // Returns the relationship between the current document and the linked document
    link.setAttribute('rel', 'stylesheet');
    // Returns the URL of the linked document
    link.setAttribute('href', 'styles/' + theme + '.css');
    // Add link element into <head>
    document.getElementsByTagName('head')[0].appendChild(link);

    // Create the angular app and inject angular modules into HygieiaConfigure module
    angular.module(HygieiaConfig.module, [
        'ngAnimate', // Provides support for CSS-based and JS-based animations
        'ngSanitize', // Provides functionality to sanitize HTML
        'ngRoute', // Provides routing and deeplinking services and directives
        HygieiaConfig.module + '.core',
        'ui.bootstrap', // Provides native AngularJS directives based on Bootstrap's markup and CSS
        'fitText', // A jQuery plugin for inflating web type
        'angular-chartist', // Angular directive for Chartist.js
        'ngCookies', // Provides a convenient wrapper for reading and writing browser cookies
        'validation.match', // Checks if one input matches another. Useful for confirming passwords, emails, or anything.
        'as.sortable',
        'ui.select',
        'chart.js',
        'gridshore.c3js.chart',
        'ui.multiselect',
        'toaster'
    ])
    .config(['$httpProvider',
        // Intercepting the http provider allows us to use relative routes
        // in data providers and then redirect them to a remote api if
        // necessary
        function ($httpProvider) {
            $httpProvider.interceptors.push(function () {
                return {
                    request: function (config) {
                        var path = config.url;
                        if(config.url.substr(0, 1) != '/') {
                            path = '/' + config.url;
                        }

                        if(!!HygieiaConfig.api && path.substr(0, 5) == '/api/') {
                            config.url = HygieiaConfig.api + path;
                        }

                        return config;
                    }
                }
            })
        }
    ])
    .config(function ($routeProvider) {
        $routeProvider
            // Main dashboard page
            .when('/dashboard/:id', {
                templateUrl: 'app/dashboard/views/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'ctrl',
                resolve: {
                    dashboard: function ($route, dashboardData) {
                        return dashboardData.detail($route.current.params.id);
                    }
                }
            })
            // Administrative functionality
            .when('/admin', {
                templateUrl: 'app/dashboard/views/admin.html',
                controller: 'AdminController',
                controllerAs: 'ctrl'
            })
            // Dashboard selection/creation
            .when('/site', {
                templateUrl: 'app/dashboard/views/site.html',
                controller: 'SiteController',
                controllerAs: 'ctrl'
            })
            // Login
            .when('/', {
                templateUrl: 'app/dashboard/views/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            })
            // Signup account
            .when('/signup', {
                templateUrl:'app/dashboard/views/signup.html',
                controller: 'SignupController',
                controllerAs: 'signup'
            })
            // Configuration
            .when('/configuration', {
                templateUrl:'components/templates/configuration.html',
                controller: 'ConfigurationTemplateController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})();