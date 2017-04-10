/**
 * Gets feature related data
 */
(function() {
	'use strict';

	angular.module(HygieiaConfig.module + '.core').factory('featureData', featureData);

	function featureData($http) {
		var componentParam = '?component=';
		var collectorParam = '?collector=';
		var projectParam = '&projectId=';
		var param = '?product=';
		var param2 = '&target='

		//////
		var healthBarRoute='api/producthealthBar';
		var healthBarRoute2='api/producthealthBarReleaseDate';
		var openDefectsRoute = 'api/productOpenDefects';
		var newDefectsRoute = 'api/productNewDefects';
		var defectReductionTrendRoute = 'api/defectReductionTrend';
		var epicCompletionRoute = 'api/productEpicEstimate'
		var openATLDefectsRoute = 'api//productOpenATLDefects';
		var agileType = {
			kanban : "&agileType=kanban",
			scrum : "&agileType=scrum",
		};
		var estimateMetricTypeParam = "&estimateMetricType=";
		var agileTypeParam = "&agileType=";

		var testAggregateSprintEstimates = 'test-data/feature-aggregate-sprint-estimates.json';
		var buildAggregateSprintEstimates = '/api/feature/estimates/aggregatedsprints/';

		var testFeatureWip = 'test-data/feature-super.json';
		var buildFeatureWip = '/api/feature/estimates/super/';

		var testSprint = 'test-data/feature-iteration.json';
		var buildSprint = '/api/iteration/';

		var testTeams = 'test-data/collector_type-scopeowner.json';
		var buildTeams = '/api/collector/item/type/ScopeOwner';

		var testTeamByCollectorItemId = 'test-data/collector_item-scopeowner.json';
		var buildTeamByCollectorItemId = '/api/collector/item/';

		var testProjectsRoute = 'test-data/projects.json';
        var buildProjectsRoute = '/api/scope';

        // new code
        var impactedProductsRoute = '/api/productList';
        var targetListRoute = '/api/targetList';

		return {
			sprintMetrics : aggregateSprintEstimates,
			featureWip : featureWip,
			sprint : sprint,
			teams : teams,
			teamByCollectorItemId : teamByCollectorItemId,
			projects : projects,
			//// new code added
			healthBar:healthBar,
			impactedProducts : impactedProducts,
			targetList : targetList,
			healthBarReleaseDate: healthBarReleaseDate,
			openDefects: openDefects,
			newDefects : newDefects,
			defectReductionTrend : defectReductionTrend,
			epicCompletion : epicCompletion,
			openATLDefects: openATLDefects
		};

		function aggregateSprintEstimates(componentId, collectorId, filterTeamId, filterProjectId, estimateMetricType, agileType) {
			return $http.get(HygieiaConfig.local ? testAggregateSprintEstimates : buildAggregateSprintEstimates + filterTeamId
					+ (collectorId != null? collectorParam + collectorId : componentParam + componentId )
				+ projectParam + filterProjectId
					+ (estimateMetricType != null? estimateMetricTypeParam + estimateMetricType : "")
					+ (agileType != null? agileTypeParam + agileType : ""))
					.then(function(response) {
						return response.data;
					});
		}
		////
		 function healthBar() {
			 return $http.get(healthBarRoute).then(function (response) {
	                return response.data;
	            }, function (response) {
	                return response.data;
	            });
        }

		/**
		 * Retrieves current super features and their total in progress
		 * estimates for a given sprint and team
		 *
		 * @param componentId
		 * @param filterTeamId
		 */
		function featureWip(componentId, collectorId, filterTeamId, filterProjectId, estimateMetricType, agileType) {
			return $http.get(HygieiaConfig.local ? testFeatureWip : buildFeatureWip + filterTeamId
					+ (collectorId != null? collectorParam + collectorId : componentParam + componentId )
					+ projectParam + filterProjectId
					+ (estimateMetricType != null? estimateMetricTypeParam + estimateMetricType : "")
					+ (agileType != null? agileTypeParam + agileType : ""))
					.then(function(response) {
						return response.data;
					});
		}

		/**
		 * Retrieves current team's sprint detail
		 *
		 * @param componentId
		 * @param filterTeamId
		 */
		function sprint(componentId, collectorId, filterTeamId, filterProjectId, agileType) {
			return $http.get(HygieiaConfig.local ? testSprint : buildSprint + filterTeamId
					+ (collectorId != null? collectorParam + collectorId : componentParam + componentId )
					+ projectParam + filterProjectId
					+ (agileType != null? agileTypeParam + agileType : ""))
					.then(function(response) {
						return response.data;
					});
		}

		/**
		 * Retrieves all team names and team IDs
		 */
		function teams() {
			return $http.get(HygieiaConfig.local ? testTeams : buildTeams)
					.then(function(response) {
						return response.data;
					});
		}

		/**
		 * Retrieves a given team by its collector item ID
		 *
		 * @param collectorItemId
		 */
		function teamByCollectorItemId(collectorItemId) {
			return $http.get(HygieiaConfig.local ? testTeamByCollectorItemId : buildTeamByCollectorItemId + collectorItemId)
					.then(function(response) {
						return response.data;
					});
		}

		/**
         * Retrieves all projects
         */
        function projects() {
            return $http.get(HygieiaConfig.local ? testProjectsRoute : (buildProjectsRoute))
                .then(function (response) {
                    return response.data;
                });
        }

        // get all impacted products
        function impactedProducts() {
        	 return $http.get(impactedProductsRoute).then(function (response) {
        	 return response.data;
            }, function (response) {
                return response.data;
            });
        }

        // get all impacted products
        function targetList() {
        	 return $http.get(targetListRoute).then(function (response) {
        	 return response.data;
            }, function (response) {
                return response.data;
            });
        }

     // get health
        function healthBar(impactedProducts ,targetList) {
        	return $http.get(healthBarRoute + param + impactedProducts + param2 + targetList).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }
        // get health release date
        function healthBarReleaseDate(impactedProducts ,targetList) {
        	return $http.get(healthBarRoute2 + param + impactedProducts + param2 + targetList).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }

        // get epicCompletion
        function epicCompletion(impactedProducts ,targetList) {
        	return $http.get(epicCompletionRoute + param + impactedProducts + param2 + targetList).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }

     // get open defects
        function openDefects(impactedProducts ,targetList) {
        	return $http.get(openDefectsRoute + param + impactedProducts + param2 + targetList).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }

     // get openATLDefects
        function openATLDefects(impactedProducts ,targetList) {
        	return $http.get(openATLDefectsRoute + param + impactedProducts + param2 + targetList).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }

     // get open defects
        function newDefects(impactedProducts ,targetList) {
        	return $http.get(newDefectsRoute + param + impactedProducts + param2 + targetList).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }

     // get open defects
        function defectReductionTrend(impactedProducts ,targetList) {
        	return $http.get(defectReductionTrendRoute + param + impactedProducts + param2 + targetList).then(function (response) {
        		return response.data;
            }, function (response) {
                return response.data;
            });
        }

	}
})();