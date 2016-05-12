define([
    'app',
    'ng-file-upload',
    'services/serverCallService',
    'services/storageService',
    'services/toastService'
], function (app) {
    return ['$scope', '$mdDialog', '$location', 'serverCallService', '$rootScope', 'storageService', 'Upload', 'toastService', '$timeout','authenticatedUserService',
        function ($scope, $mdDialog, $location, serverCallService, $rootScope, storageService, Upload, toastService, $timeout, authenticatedUserService) {
            $scope.isSaving = false;
            $scope.showHints = true;

            serverCallService.makeGet("rest/homework", {}, homeworkSuccess, fail);

            function homeworkSuccess(homeworks) {
                console.log(homeworks);
                $scope.homeworks = homeworks;

            }

            function fail() {
                console.log("dobby failed you master")
            }

            if ($rootScope.subject && $rootScope.type) {
                $scope.default = {
                    subject: $rootScope.subject,
                    type: $rootScope.type
                };


                $rootScope.subject = undefined;
                $rootScope.type = undefined;
            }

            $scope.upload = function (file) {
                $scope.uploading = true;
                $scope.file = file;

                Upload.upload({
                    url: 'rest/homework/upload',
                    data: {file: file, 'username': $scope.username}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.progress = progressPercentage;
                    if (progressPercentage === 100) $scope.uploaded = true;
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };

            $scope.cancel = function () {
                $mdDialog.hide();
            };

            function success(data) {
                toastService.show("Esitatud");
                $scope.saving = false;
                $mdDialog.hide();

            }

            function fail(err) {
                toastService.show("Esitamine ebaõnnestus");

            }

            $scope.create = function () {
                var work = JSON.parse($scope.work);
                console.log(work.subject);
                $scope.saving = true;

                var uploadWork = {
                    subject: work.subject,
                    type: work.type,
                   // file: $scope.file,
                    result: 'Esitatud'
                };

                serverCallService.makePost("rest/homework", uploadWork, success, fail);
            };
        }
    ];
});
