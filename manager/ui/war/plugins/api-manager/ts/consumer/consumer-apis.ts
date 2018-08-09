/// <reference path="../apimanPlugin.ts"/>
module Apiman {

    export var ConsumerApisController = _module.controller("Apiman.ConsumerApisController",
        ['$q', '$location', '$scope', 'ApimanSvcs', 'PageLifecycle', 'Logger',
        ($q, $location, $scope, ApimanSvcs, PageLifecycle, Logger) => {
            var params = $location.search();
            if (params.q) {
                $scope.apiName = params.q;
            }

            $scope.searchSvcs = function(value) {
                $location.search('q', value);
            };

            // filter at client side
            $scope.filterApis = function (searchText) {
                $scope.criteria = searchText;
            };

            var pageData = {
                apis: $q(function(resolve, reject) {
                    if (params.q) {
                        var body:any = {};
                        body.filters = [];
                        body.filters.push( {"name": "name", "value": "*" + params.q + "*", "operator": "like"});
                        body.page = 1;
                        body.pageSize = 10000; // ES index.max_result_window
                        var searchStr = angular.toJson(body);
                        
                        ApimanSvcs.save({ entityType: 'search', secondaryType: 'apis' }, searchStr, function(reply) {
                            resolve(reply.beans);
                        }, reject);
                    } else {
                        resolve([]);
                    }
                })
            };

            function loadAllEntries() {
                if ($scope.apis.length == 0) {
                   $scope.searchSvcs('*')
                }
            }

            PageLifecycle.loadPage('ConsumerApis', undefined, pageData, $scope, function() {
                PageLifecycle.setPageTitle('consumer-apis');
                loadAllEntries();
            });
        }]);

}
