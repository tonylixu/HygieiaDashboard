/**
 * Controller for performing authentication or signingup a new user */
(function () {
    'use strict';
    var app = angular.module(HygieiaConfig.module)
    var inject = ['$cookies', '$http', '$location', '$scope', 'loginData', 'dashboardData','$cookieStore']
    function LoginController($cookies, $http, $location, $scope, loginData, dashboardData, $cookieStore) {
        if ($cookies.authenticated) {
        	 $cookieStore.remove("username");
             $cookieStore.remove("authenticated");
             $location.path('/');
            return;
        }
        var login = this;
        login.showAuthentication = $cookies.authenticated;
        login.templateUrl = 'app/dashboard/views/navheader.html';
        login.apiup = false;
        login.username = '';
        login.password = '';
        login.invalidUsernamePassword = false;
        login.appVersion='';


        login.doLogin = function () {
            $scope.lg.username.$setValidity('invalidUsernamePassword', true);
            var valid = $scope.lg.$valid;
            if (valid) {
                loginData.login(login.username, login.password)
                    .then(function (data) {
                        $scope.lg.username.$setValidity(
                          'invalidUsernamePassword',
                          data
                        );
                        if (data) {
                            $cookies.authenticated = true;
                            $cookies.username = login.username;
                           // $location.path('/site');
                            var submitData = {
                                    template: "capone",
                                    title: "Zebra_EMC",
                                    type: "team",
                                    applicationName: "Zebra_EMC",
                                    componentName: "Zebra_EMC",
                                    owner: $cookies.username
                                };
                            dashboardData
                                .create(submitData)
                                .success(function (data) {
                                    // redirect to the new dashboard
                                    $location.path('/dashboard/' + data.id);
                                    // close dialog
                                })
                                .error(function (data) {
                                    // display error message
                                dashboardData.search().then(function (data) {
                                       console.log("Dashboard Data :"+angular.toJson(data));

                                       $location.path('/dashboard/' + data[0].id);
                                        // close dialog
                                    })
                                   // form.dashboardTitle.$setValidity('createError', false);
                                });

                        }
                    });
            }
        };
        login.doSignup = function () {
            $location.path('/signup');
        };
        function checkApi() {
            var url = '/api/dashboard';
            $http.get(url).success(function (data, status) {
                login.apiup = (status == 200);
            }).error(function (data, status) {
                login.apiup = false;
            });
        }
        checkApi();

        function getAppVersion(){
            var url = '/api/appinfo';
            $http.get(url).success(function (data, status) {
                console.log("appinfo:"+data);
                login.appVersion=data;
            }).error(function(data,status){
                console.log("appInfo:"+data);
                login.appVersion="0.0";
            });
        }
        getAppVersion();

    }
    app.controller('LoginController', inject.concat([LoginController]));
})();