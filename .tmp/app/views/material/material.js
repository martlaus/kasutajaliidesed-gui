define([
    'app',
    'angularAMD',
    'angular-youtube-mb',
    'angular-screenfull',
    'directives/copyPermalink/copyPermalink',
    'directives/report/improper/improper',
    'directives/report/brokenLink/brokenLink',
    'directives/recommend/recommend',
    'directives/rating/rating',
    'directives/commentsCard/commentsCard',
    'directives/slideshare/slideshare',
    'directives/tags/tags',
    'services/serverCallService',
    'services/translationService',
    'services/searchService',
    'services/alertService',
    'services/authenticatedUserService',
    'services/dialogService',
    'services/iconService',
    'services/toastService',
    'services/storageService',
    'services/targetGroupService'
], function (app, angularAMD) {
    return ['$scope', 'serverCallService', '$route', 'translationService', '$rootScope', 'searchService', '$location', 'alertService', 'authenticatedUserService', 'dialogService', 'toastService', 'iconService', '$mdDialog', 'storageService', 'targetGroupService',
        function ($scope, serverCallService, $route, translationService, $rootScope, searchService, $location, alertService, authenticatedUserService, dialogService, toastService, iconService, $mdDialog, storageService, targetGroupService) {
            $scope.showMaterialContent = false;


            serverCallService.makeGet("rest/homework/user", {}, homeworkSuccess, fail);

            function homeworkSuccess(homeworks) {
                console.log(homeworks);
                $scope.results = homeworks;

            }

            function fail() {
                console.log("dobby failed you master")
            }

            $scope.gotToResult = function (subject, type) {
                $rootScope.subject = subject;
                $rootScope.type = type;

                $mdDialog.show(angularAMD.route({
                    templateUrl: 'views/addPortfolioDialog/addPortfolioDialog.html',
                    controllerUrl: 'views/addPortfolioDialog/addPortfolioDialog'
                }));
            };






        }];
});
