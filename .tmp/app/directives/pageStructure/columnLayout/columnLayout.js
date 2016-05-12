define([
  'angularAMD',
  'directives/tableOfContents/tableOfContents',
  'directives/alert/alert'
 ], function(angularAMD) {
    angularAMD.directive('dopColumnLayout', function() {
        return {
            scope: true,
            templateUrl: 'directives/pageStructure/columnLayout/columnLayout.html',
            controller: ["$scope", "$rootScope", "$mdSidenav", function($scope, $rootScope, $mdSidenav) {
                $scope.toggleSidenav = function() {
                    $mdSidenav('left').toggle();
                };
                $scope.$watch(function() {
                    return $rootScope.savedPortfolio;
                }, function(newPortfolio, oldPortfolio) {
                    $scope.portfolio = newPortfolio;
                });

                $scope.portfolio = $rootScope.savedPortfolio;
            }]
        };
    });
});