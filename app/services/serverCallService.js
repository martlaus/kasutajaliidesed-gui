define(['angularAMD'], function (angularAMD) {
    var instance;

    angularAMD.factory('serverCallService', ['$http', '$location', 'authenticatedUserService', "Upload",
        function ($http, $location, authenticatedUserService, Upload) {

            function makeCall(url, method, params, includeAuthentication, successCallback, errorCallback, finallyCallback, transformRequest) {
                var headers = {};

                setAuthorization(headers);


                var config = {
                    method: method,
                    url: url,
                    headers: headers
                };

                if (method === 'POST' || method === 'PUT') {
                    config.data = params;
                } else {
                    config.params = params;
                }

                if (transformRequest) {
                    config.transformRequest = transformRequest
                }

                $http(config).
                    success(function (data) {
                        successCallback(data);
                    }).error(function (data, status, headers, config) {
                        if (status == '419') {
                            authenticatedUserService.removeAuthenticatedUser();
                            makeCall(url, method, params, false, successCallback, errorCallback, finallyCallback, transformRequest);
                        } else if (status == '401') {
                            $location.url('/');
                        } else if (errorCallback) {
                            errorCallback(data, status);
                        }
                    }).finally(finallyCallback);
            }

            function setAuthorization(headers) {
                if (authenticatedUserService.isAuthenticated()) {
                    var user = authenticatedUserService.getUser();

                    headers.Token = authenticatedUserService.getToken();
                    headers.Code = user.code;
                }
            }

            instance = {
                makePost: function (url, data, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'POST', data, true, successCallback, errorCallback, finallyCallback);
                },

                makeGet: function (url, params, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'GET', params, true, successCallback, errorCallback, finallyCallback);
                },

                makePut: function (url, data, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'PUT', data, true, successCallback, errorCallback, finallyCallback);
                },
                makeDelete: function (url, data, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'DELETE', data, true, successCallback, errorCallback, finallyCallback);
                },

                makeJsonp: function (url, params, successCallback, errorCallback, finallyCallback) {
                    makeCall(url, 'JSONP', params, false, successCallback, errorCallback, finallyCallback);
                },

                upload: function (url, data, successCallback, errorCallback, finallyCallback) {
                    var headers = {};
                    setAuthorization(headers);

                    Upload.upload({
                        url: url,
                        data: data,
                        headers: headers
                    }).then(successCallback, errorCallback).finally(finallyCallback);
                }

                //getUrl: function() {
                //    return baseUrl;
                //},
                //
                //setUrl: function(url) {
                //    baseUrl = url;
                //}
            };

            return instance;
        }
    ]);
});
