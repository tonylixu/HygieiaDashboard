/**
 * Gets code repo related data
 */
(function () {
    'use strict';

    angular
        .module(HygieiaConfig.module + '.core')
        .factory('codeRepoData', codeRepoData);

    function codeRepoData($http) {
        var testDetailRoute = 'test-data/commit_detail.json';
        var caDetailRoute = '/api/commit';
        var projectListRoute = '/api/gerritProjects';

        return {
            details: details,
            projects: projects
        };

        // get 15 days worth of commit data for the component
        function details(params) {
            return $http.get(HygieiaConfig.local ? testDetailRoute : caDetailRoute, { params: params })
                .then(function (response) {
                    return response.data;
                });
        }

     // get all projects
        function projects() {
              return $http.get(projectListRoute).then(function (response) {
              return response.data;
            }, function (response) {
                return response.data;
            });
        }

    }
})();