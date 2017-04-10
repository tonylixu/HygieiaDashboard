/**
 * Gets build related data
 */
 (function () {
    'use strict';

    angular
        .module(HygieiaConfig.module + '.core')
        .factory('buildData', buildData);

    function buildData($http) {
        var testDetailRoute = 'test-data/build_detail.json';
        var runDetailRoute = '/api/buildRun/';
        var buildDetailRoute = '/api/build/';
        var param = '?viewName=';

        return {
            details: details,
            detailRun:detailRun
        };

        // Search for current builds
        function details(params){
            return $http.get(HygieiaConfig.local ? testDetailRoute : buildDetailRoute, { params: params })
            .then(function (response) {
                return response.data;
            });
        }

        function detailRun(viewName) {
            return $http.get(runDetailRoute+ param + viewName).then(function (response) {
                return response.data;
            });
        }
    }
 })();