define(function() {
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                templateUrl: 'views/home/home.html',
                controllerUrl: 'views/home/home'
            },
            '/student': {
                templateUrl: 'views/material/material.html',
                controllerUrl: 'views/material/material'
            },
            '/teacher': {
                templateUrl: 'views/portfolio/portfolio.html',
                controllerUrl: 'views/portfolio/portfolio'
            },
            '/:username': {
                templateUrl: 'views/profile/profile.html',
                controllerUrl: 'views/profile/profile'
            }
        }
    };
});
