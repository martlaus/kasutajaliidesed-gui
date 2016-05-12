define([
    'angularAMD',
    'services/authenticationService',
    'services/translationService',
    'services/authenticatedUserService'
], function (app) {
    return ['$scope', '$mdDialog', 'authenticationService', '$location', 'translationService', '$rootScope', 'authenticatedUserService',
        function ($scope, $mdDialog, authenticationService, $location, translationService, $rootScope, authenticatedUserService) {

        $scope.$watch(function () {
            return authenticatedUserService.isAuthenticated()
        }, function (newValue, oldValue) {
            if (newValue == true) {
                $mdDialog.hide();
            }
        }, false);

        $rootScope.$on('$routeChangeSuccess', function () {
            $mdDialog.hide();
        });

        $scope.hideLogin = function () {
            $mdDialog.hide();
        };

        $scope.signUp = function () {

            $scope.loginButtonFlag = true;

            var user = {
                code: $scope.studentCode,
                password: $scope.password,
                name: $scope.name
            };

            authenticationService.signup(user);

        };
    }];
});
