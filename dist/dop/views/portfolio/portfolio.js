define([
    'app',
    'directives/copyPermalink/copyPermalink',
    'directives/report/improper/improper',
    'directives/report/brokenLink/brokenLink',
    'directives/recommend/recommend',
    'directives/rating/rating',
    'directives/commentsCard/commentsCard',
    'directives/chapter/chapter',
    'directives/materialBox/materialBox',
    'directives/portfolioSummaryCard/portfolioSummaryCard',
    'services/serverCallService',
    'services/translationService',
    'services/alertService',
    'services/authenticatedUserService',
    'angular-material-data-table'
], function (app) {
    return ['$scope', 'translationService', 'serverCallService', '$route', '$location', 'alertService', '$rootScope', 'authenticatedUserService', '$timeout', 'toastService',
        function ($scope, translationService, serverCallService, $route, $location, alertService, $rootScope, authenticatedUserService, $timeout, toastService) {

            //$scope.students = $rootScope.students;
            $scope.selected = [];

            serverCallService.makeGet("rest/homework", {}, homeworkSuccess, fail);

            function homeworkSuccess(homeworks) {
                //console.log(homeworks);
                $scope.homeworks = homeworks;

            }

            serverCallService.makeGet("rest/user/student", {subject: 1}, studentSuccess, fail);

            function studentSuccess(students) {
                console.log(students);
                $scope.students = students;

                $scope.itemsCount = $scope.students.length;


            }

            function fail() {
                console.log("dobby failed you master")
            }

            $scope.updateGrade = function (grade) {
                if(grade.grade !== "") {
                    serverCallService.makePost("rest/grade", grade, gradeSuccess, fail);
                }
            };

            function gradeSuccess(grade) {
                console.log(grade);
                //$scope.students = students;

                toastService.show("Hinne uuendatud");

            }


            $scope.query = {
                filter: '',
                limit: 10,
                page: 1
            };

            $scope.onReorder = function (order) {
                var data = $scope.students;
                orderItems(data, order);

               // $scope.students = data;//paginate($scope.query.page, $scope.query.limit);
            };

            $scope.getAverge = function(grades) {
                var average;
                for(var grade in grades) {
                    average += parseInt(grade.grade);
                }

                return average;
            }

            function orderItems(data, order) {
                data = data.sort(function (a, b) {
                    if (a && b) {

                        if (order === 'bykt1' || order === '-bykt1')
                            return new Date(b.kt1) - new Date(a.kt1);

                        if (order === 'bykt2' || order === '-bykt2')
                            return new Date(b.kt2) - new Date(a.kt2);

                        if (order === 'bypraktiline1' || order === '-bypraktiline1')
                            return new Date(b.praktiline1) - new Date(a.praktiline1);

                        if (order === 'bypraktiline2' || order === '-bypraktiline2')
                            return new Date(b.praktiline2) - new Date(a.praktiline2);

                        if (order === 'byeksam' || order === '-byeksam')
                            return new Date(b.eksam) - new Date(a.eksam);

                        if (order === 'byeksam2' || order === '-byeksam2')
                            return new Date(b.eksam2) - new Date(a.eksam2);

                        if (order === 'bySubmittedBy' || order == '-bySubmittedBy')
                            return (a.name).localeCompare(b.name);
                    }

                    return 0;
                });

                if (order.slice(0, 1) === '-')
                    data.reverse();
            }


            function paginate(page, limit) {
                var skip = (page - 1) * limit;
                var take = skip + limit;

                if (filtredCollection !== null)
                    return filtredCollection.slice(skip, take);

                return collection.slice(skip, take);
            }


        }];
});
