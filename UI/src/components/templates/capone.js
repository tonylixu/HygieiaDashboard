/**
 * Controller for the dashboard route. Render proper template.
 */
(function() {
    'use strict';

    angular.module(HygieiaConfig.module).controller('CapOneTemplateController',
            CapOneTemplateController);

    CapOneTemplateController.$inject = [ '$scope', 'productData', '$location',
            '$modal', '$log', '$rootScope', 'polarionData', 'toaster','$cookies' ,'$cookieStore'];
    function CapOneTemplateController($scope, productData, $location, $modal,
            $log, $rootScope, polarionData, toaster , $cookies,$cookieStore) {
        var ctrl = this;
        $scope.username = $cookies.username;
        console.log("Username :"+$cookies.username);
        ctrl.showAuthentication = $cookies.authenticated;
        if (ctrl.username === 'admin') {
            ctrl.myadmin = true;
        }

        $scope.logout = function ()
        {
            $cookieStore.remove("username");
            $cookieStore.remove("authenticated");
            $location.path('/');
        }

        $scope.productSelected = false;
        $scope.products = [];
        $scope.view = '';
        ctrl.tabs = [ {
            name : "Widget"
        }, {
            name : "Pipeline"
        }, {
            name : "Cloud"
        } ];

        ctrl.widgetView = ctrl.tabs[0].name;
        ctrl.toggleView = function(index) {
            ctrl.widgetView = typeof ctrl.tabs[index] === 'undefined' ? ctrl.tabs[0].name
                    : ctrl.tabs[index].name;
        };

        $scope.productConfig = {};
        $scope.productMeta = {};
        $scope.isDisabled = true;
        $scope.init = function() {
            productData.details().then(function(data) {
                //console.log(angular.toJson(data));
                var productData = data[0].hierarchy;
                for(var i =0;i<productData.length;i++){
                    var prod = {
                            "name" : productData[i]
                        }
                        $scope.products.push(prod);
                }
            });
            // library detail
            var libraryName = "STTL";
            polarionData.libDetails(libraryName).then(function(data) {
                $scope.testLibList = data;
            });

        }
        $scope.selectProduct = function(productMeta) {

            var productName = productMeta.name;
            $scope.productName = productName;

            // product detail
            polarionData.productDetails(productName).then(function(data) {
                console.log("Polarion Product Data :"+angular.toJson(data));
                $scope.capabilitiesEntity = data.polarionCapabilitiesEntity;
                $scope.testTypeListYearly = data.polarionTestTypeListYearly;
                $scope.testTypeListMonthly = data.polarionTestTypeListMonthly;
                $scope.testTypeList = $scope.testTypeListYearly;
                $scope.polarionTestRun = data.polarionTestRun;
            });

            productData
                    .config(productName)
                    .then(
                            function(data) {
                                console.log("data..../" + angular.toJson(data));
                                if (data == 'Internal error.') {
                                    toaster.pop({
                                        type : 'error',
                                        title : 'Product Configuration',
                                        body : 'Product is not configured',
                                        toasterId : 1
                                    });
                                    $rootScope.jenkinsViewName = '';
                                    $scope.productSelected = false;
                                    $scope.isDisabled = true;

                                } else {
                                    $rootScope.jenkinsViewName = data.product.jenkinsView;
                                    if (Object.keys(data.gerritId).length == 0) {
                                        toaster
                                                .pop({
                                                    type : 'warning',
                                                    title : 'Product Configuration',
                                                    body : 'Gerrit is not configured properly',
                                                    toasterId : 1
                                                });
                                    } else {

                                        $scope.gerritComponentId = data.gerritId.gerritId;
                                        $scope.gerritConfig = true;
                                    }
                                    if (Object.keys(data.jiraConfig).length == 0) {
                                        toaster
                                                .pop({
                                                    type : 'warning',
                                                    title : 'Product Configuration',
                                                    body : 'Jira is not configured properly',
                                                    toasterId : 1
                                                });
                                    } else {
                                        $scope.impactedProducts = data.jiraConfig.impactedProducts;
                                        $scope.targetList = data.jiraConfig.targetList;
                                        $scope.jiraConfig = true;
                                    }
                                    if (!data.product.viewName) {
                                        toaster
                                                .pop({
                                                    type : 'warning',
                                                    title : 'Product Configuration',
                                                    body : 'Jenkins is not configured properly',
                                                    toasterId : 1
                                                });
                                    } else {
                                        var view = data.product.viewName
                                                .split('-');
                                        // $scope.viewName = view[1];
                                        $scope.jenkinsViewName = view[1];
                                        $scope.jenkinsConfig = true;
                                    }
                                    $scope.productSelected = true;
                                }

                            },
                            function(error) {
                                console.log("error.." + error);
                                toaster.pop('error', 'Product Configuration',
                                        'Product is not cofigured');
                            });
            $scope.view = '';
        }
        $scope.showView = function() {
            $scope.productSelected = false;
        }
        $scope.openView = function(name) {
            $scope.view = name;
            $scope.productSelected = false;
        }
        $scope.openGerritView = function(name) {
            $scope.view = name;
            if($scope.gerritConfig == true){
                $scope.productSelected = false;
            } else {
                toaster
                .pop({
                    type : 'warning',
                    title : 'Product Configuration',
                    body : 'Gerrit is not configured properly',
                    toasterId : 1
                });
            }
        }
        $scope.openJenkinsView = function(name) {
            $scope.view = name;
            if($scope.jenkinsConfig == true){
                $scope.productSelected = false;
            } else {
                toaster
                .pop({
                    type : 'warning',
                    title : 'Product Configuration',
                    body : 'Jenkins is not configured properly',
                    toasterId : 1
                });
            }
        }
        $scope.goToView = function(view, dashboard) {
            $scope.dashboard = dashboard;
            $scope.view = view;
            $scope.productConfig = {};
            $scope.viewName = '';
            $scope.productSelected = true;

        }
        $scope.goToMain = function(view) {
            $scope.view = view;
            $scope.productName = '';
            $scope.productMeta = {};
            $scope.productSelected = false;
        }

        $scope.onSelectedProduct = function(productConfig) {
            $scope.productName = productConfig.name;
            productData
                    .config($scope.productName)
                    .then(
                            function(data) {
                                if (data == 'Internal error.') {
                                    $scope.viewname1 = '';
                                    var textarea = document
                                            .getElementById("gerrit_textarea");
                                    textarea.value = '';
                                    var textarea2 = document
                                            .getElementById("impactedProducts_textarea");
                                    textarea2.value = '';
                                    var textarea3 = document
                                            .getElementById("targetList_textarea");
                                    textarea3.value = '';
                                } else {
                                    $scope.viewname1 = data.product.viewName;
                                    $rootScope.viewname= data.product.viewname;
                                    $rootScope.gerritId = data.gerritId.gerritId;
                                    $rootScope.projectList = data.gerritId.projectList;
                                    $rootScope.impactedProducts = data.jiraConfig.impactedProducts;
                                    $rootScope.targetList = data.jiraConfig.targetList;
                                    console.log(data.product);
                                    console.log(data.product.viewname);
                                    var textarea = document.getElementById("jenkins_textarea");
                                    if($scope.viewname1 != undefined){
                                        textarea.value = $scope.viewname1;
                                    } else {
                                        textarea.value = '';
                                    }
                                    if (Object.keys(data.gerritId).length != 0) {
                                    var your_array = data.gerritId.projectList;
                                    var textarea = document
                                            .getElementById("gerrit_textarea");
                                    textarea.value = your_array.join("\n");
                                    }
                                    if (Object.keys(data.jiraConfig).length != 0) {
                                        var textarea2 = document
                                                .getElementById("impactedProducts_textarea");
                                        var textarea3 = document
                                                .getElementById("targetList_textarea");
                                        var impactedProducts_array = data.jiraConfig.impactedProducts;
                                        textarea2.value = impactedProducts_array
                                                .join("\n");

                                        var targetList_array = data.jiraConfig.targetList;
                                        var textarea3 = document
                                                .getElementById("targetList_textarea");
                                        textarea3.value = targetList_array
                                                .join("\n");

                                    }

                                }

                            });
        }
        // to be set by link
        $scope.saveConfig = function() {
            var postObj = {
                productName : $scope.productName,
                jenkinsView : $rootScope.componentId,
                viewName : $rootScope.viewName,
                gerritId : $rootScope.gerritId,
                impactedProducts : $rootScope.impactedProducts,
                targetList : $rootScope.targetList,
                projectList : $rootScope.projectList

            };
            productData.save(postObj).then(function(data) {
                toaster.pop({
                    type : 'success',
                    title : 'Product Configuration',
                    body : 'Product is configured successfully',
                    toasterId : 1
                });
            }, function(error) {
                toaster.pop({
                    type : 'error',
                    title : 'Product Configuration',
                    body : 'Product is not configured successfully',
                    toasterId : 1
                });
            });
            $scope.view = '';
        }

        $scope.init();

    }
})();