/**
 * Gets build related data
 */
(function () {
    'use strict';

    angular
        .module(HygieiaConfig.module + '.core')
        .factory('productData', productData);

    function productData($http) {
        var productListRoute = '/api/allProducts';
        var configRoute = '/api/configuration';
        var param = '?productName=';
        return {
            details: details,
            save: save,
            config: config
        };

        // get all products
        function details(serviceUrl) {
        	 return $http.get(productListRoute).then(function (response) {
        	 return response.data;
            }, function (response) {
                return response.data;
            });
        }

     // save product mapping
        function save(data) {
            return $http.post(configRoute, data)
                .success(function (response) {
                 return response.data;
                })
                .error(function (response) {
                    return null;
                });
        }
     // get config
        function config(productName) {
        	return $http.get(configRoute + param + productName).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }
    }
})();