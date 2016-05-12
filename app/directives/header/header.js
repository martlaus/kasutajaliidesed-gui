define([
    'angularAMD',
    'services/serverCallService',
    'services/toastService',
    'services/authenticationService',
    'services/authenticatedUserService'
], function (angularAMD) {
    angularAMD.directive('dopHeader', ['translationService', '$location', '$mdDialog', 'toastService', 'authenticatedUserService', 'authenticationService',
        function (translationService, $location, $mdDialog, toastService, authenticatedUserService, authenticationService) {
            return {
                templateUrl: 'directives/header/header.html',
                controller: function ($scope, $location, $rootScope) {

                    $scope.doLogin = function () {
                        console.log($scope.studentCode)

                        if ($scope.studentCode && $scope.password) {
                            authenticationService.signin({
                                code: $scope.studentCode,
                                password: $scope.password
                            })
                        } else {
                            toastService.show("Vale kasutajanimi või parool");
                            console.log("rega pls");
                        }
                    };

                    $scope.logout = function () {
                        authenticationService.logout();

                        $location.url('/');
                    };

                    $scope.register = function (ev) {
                        $mdDialog.show(angularAMD.route({
                            templateUrl: 'views/loginDialog/loginDialog.html',
                            controllerUrl: 'views/loginDialog/loginDialog',
                            targetEvent: ev
                        }));
                    };

                    $scope.isAuthenticated = function () {
                        return authenticatedUserService.isAuthenticated();
                    }

                    $scope.isAdmin = function () {
                        return authenticatedUserService.isAdmin();
                    }

                }
            };
        }
    ]);
});
