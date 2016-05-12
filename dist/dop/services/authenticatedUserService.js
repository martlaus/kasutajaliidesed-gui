define(['angularAMD'], function (angularAMD) {
    var instance;

    angularAMD.factory('authenticatedUserService', ['$location',
        function ($location) {

            instance = {
                setAuthenticatedUser: function (authenticatedUser) {
                    localStorage.setItem("authenticatedUser", JSON.stringify(authenticatedUser));
                },

                getAuthenticatedUser: function () {
                    return JSON.parse(localStorage.getItem("authenticatedUser"));
                },

                removeAuthenticatedUser: function () {
                    localStorage.removeItem("authenticatedUser");
                },

                isAuthenticated: function () {
                    if (instance.getAuthenticatedUser()) {
                        return true;
                    }

                    return false;
                },

                isAdmin: function () {
                	var user = this.getUser();
                    return user && user.role === 'ADMIN';
                },

                getUser: function () {
                    var authenticatedUser = instance.getAuthenticatedUser();
                    if (authenticatedUser) {
                        return authenticatedUser.user;
                    }

                    return null;
                },

                getToken: function () {
                    var authenticatedUser = instance.getAuthenticatedUser();
                    if (authenticatedUser) {
                        return authenticatedUser.token;
                    }

                    return null;
                }
            };

            return instance;
        }
    ]);
});
