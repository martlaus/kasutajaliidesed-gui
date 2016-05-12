define([
  'angularAMD',
  'services/alertService'
], function(angularAMD) {
    var instance;
    var isAuthenticationInProgress;
    var isOAuthAuthentication = false;

    var mobileIdLoginSuccessCallback;
    var mobileIdLoginFailCallback;
    var mobileIdChallengeReceivedCallback;

    angularAMD.factory('authenticationService', ['$location', '$rootScope', 'serverCallService', 'authenticatedUserService', 'alertService', '$mdDialog', 'toastService',
        function($location, $rootScope, serverCallService, authenticatedUserService, alertService, $mdDialog, toastService) {

            function loginSuccess(authenticatedUser) {
                if (isEmpty(authenticatedUser)) {
                    loginFail();
                } else {
                    authenticatedUserService.setAuthenticatedUser(authenticatedUser);
                    $rootScope.user = authenticatedUser.user;


                    if(authenticatedUser.user.role === "ADMIN") {
                        $location.url("/teacher");
                    } else {
                        $location.url("/student");
                    }
                }
            }

            function signUpSuccess(authenticatedUser) {
                if (isEmpty(authenticatedUser)) {
                    loginFail();
                } else {
                    authenticatedUserService.setAuthenticatedUser(authenticatedUser);
                    $rootScope.user = authenticatedUser.user;

                    $location.url("student")

                    $mdDialog.hide();
                    toastService.show("Registreeritud");
                }
            }

            function signUpFail() {
                log('Logging in failed.');
                $mdDialog.hide();
                toastService.show("Registreerimine ebaõnnestus");
                enableLogin();
                authenticatedUserService.removeAuthenticatedUser();


            }

            function loginFail() {
                log('Logging in failed.');
                toastService.show('Sisselogimine ebaõnnestus');
                enableLogin();
                authenticatedUserService.removeAuthenticatedUser();


            }

            function logoutSuccess(data) {
                authenticatedUserService.removeAuthenticatedUser();
                toastService.show("Välja logitud");

                enableLogin();
            }

            function logoutFail(data, status) {
                authenticatedUserService.removeAuthenticatedUser();
                toastService.show("Välja logitud");

                enableLogin();
            }

            function disableLogin() {
                isAuthenticationInProgress = true;
            }

            function enableLogin() {
                isAuthenticationInProgress = false;
            }


            return {

                logout: function() {
                    serverCallService.makePost("rest/signout", {}, logoutSuccess, logoutFail);
                },


                signup: function(user) {
                    serverCallService.makePost("rest/user", user, signUpSuccess, signUpFail);
                },

                signin: function(user) {
                    serverCallService.makePost("rest/signin", user, loginSuccess, loginFail);
                }
            };
        }
    ]);
});
