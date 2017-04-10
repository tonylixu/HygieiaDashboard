/**
 * Gets build related data
 */
(function () {
    'use strict';

    angular
        .module(HygieiaConfig.module + '.core')
        .factory('polarionData', polarionData);

    function polarionData($http) {
        var  libraryListRoute = '/api/libDetail';
        var param = '?libraryName=';
        var  productDetailRoute = '/api/productDetail';
        var param2 = '?productName=';
        return {
            libDetails : libDetails,
            productDetails: productDetails
        };

        // get library detail
        function libDetails(libraryName) {
        	 return $http.get(libraryListRoute + param + libraryName).then(function (response) {
        	 return response.data;
            }, function (response) {
                return response.data;
            });
        }

     // get product detail
        function productDetails(productName) {
        	 return $http.get(productDetailRoute + param2 + productName).then(function (response) {
        	 return response.data;
            }, function (response) {
                return response.data;
            });
        }
    }
})();