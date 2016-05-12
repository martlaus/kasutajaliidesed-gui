define([
    'angularAMD',

    'app.routes',
    'utils/taxonUtils',
    'utils/taxonParser',

    'angular-translate',
    'angular-messages',
    'angular-translate-loader-url',
    'angular-material',
    'angular-route',
    'angular-click-outside',
    'angular-scroll',
    'angular-material-data-table',
    'jsog',
    'utils/commons',
    'ng-file-upload',

    /* app wide modules */
    'directives/header/header',
    'directives/editPortfolioModeHeader/editPortfolioModeHeader',
    'directives/detailedSearch/detailedSearch',
    'directives/mainFabButton/mainFabButton',
    'directives/sidebar/sidebar',

    /* TODO: we could save more request if layout system is built in another way */
    'directives/pageStructure/columnLayout/columnLayout',
    'directives/pageStructure/linearLayout/linearLayout',

    'services/authenticatedUserService'
], function (angularAMD, config, taxonUtils, taxonParser, authenticatedUserService) {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'md.data.table',
        'ngMessages',
        'pascalprecht.translate',
        'angular-click-outside',
        'duScroll',
        'ngFileUpload'
    ]);

    app.config(["$routeProvider", "$locationProvider", "$controllerProvider", "$compileProvider", "$filterProvider", "$provide", "$translateProvider", "$sceProvider", "$httpProvider", "$anchorScrollProvider", function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $translateProvider, $sceProvider, $httpProvider, $anchorScrollProvider) {
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;

            if (config.routes !== undefined) {
                angular.forEach(config.routes, function (route, path) {
                    $routeProvider.when(
                        path,
                        angularAMD.route({
                            templateUrl: route.templateUrl,
                            controllerUrl: route.controllerUrl,
                            reloadOnSearch: angular.isDefined(route.reloadOnSearch) ? route.reloadOnSearch : undefined
                        })
                    );
                });
            }

            if (config.defaultRoutePath !== undefined) {
                $routeProvider.otherwise({
                    redirectTo: config.defaultRoutePath
                });
            }

            $sceProvider.enabled(false);

            $httpProvider.defaults.transformResponse.splice(0, 0, parseJSONResponse);
            $httpProvider.defaults.transformRequest = serializeRequest;

            $anchorScrollProvider.disableAutoScrolling();
        }]
    );

    function serializeRequest(data, headersGetter) {
        if (data && headersGetter()['content-type'].contains('application/json')) {
            data = clone(data);
            taxonParser.serialize(data);
            return JSOG.stringify(data);
        }

        return data;
    }

    function parseJSONResponse(data, headersGetter) {
        if (data && (headersGetter()['content-type'] === 'application/json')) {
            data = JSOG.parse(data);
            taxonParser.parse(data);
            return data;
        }

        return data;
    }



    app.run(['$rootScope', 'authenticatedUserService', function ($rootScope, authenticatedUserService) {
        $rootScope.user = JSON.parse(localStorage.getItem("user"));
        //$rootScope.results = [
        //    {subject: 'Arvutivõrgud', type:'Kontrolltöö', result: 3},
        //    {subject: 'Kasutajaliidesed', type:'Praktiline töö', result: 5},
        //    {subject: 'Filosoofia', type:'Seminar', result: 1},
        //    {subject: 'Algoritmid ja andmestruktuurid', type:'Eksam', result: 4},
        //    {subject: 'Side', type:'Kontrolltöö', result: 5},
        //    {subject: 'Bioloogia', type:'Kontrolltöö', result: 3},
        //    {subject: 'Programmeerimise põhikursus', type:'Praktiline töö', result: 5},
        //    {subject: 'Java algukursus', type:'Seminar', result: 1},
        //    {subject: 'Robootika', type:'Eksam', result: 4},
        //    {subject: 'Keemia', type:'Kontrolltöö', result: 5}
        //];

        $rootScope.assignments = [
            {subject: 'Kasutajaliidesed', type:'Praktiline töö', result: 5},
            {subject: 'Filosoofia', type:'Seminari essee', result: 1},
            {subject: 'Algoritmid ja andmestruktuurid', type:'Kodune töö', result: 4},
            {subject: 'Side', type:'Labori kokkuvõte', result: 5}
        ];

        //$rootScope.students = [
        //    {name: 'Mart Laus', kt1: 5, kt2: 5, praktiline1: 3, praktiline2: 5, eksam: 1, eksam2: 2},
        //    {name: 'Peeter Paan', kt1: 4, kt2: 2, praktiline1: 5, praktiline2: 4, eksam: 4, eksam2: 5},
        //    {name: 'Mati Maasikas', kt1: 5, kt2: 3, praktiline1: 3, praktiline2: 4, eksam: 5, eksam2: 3},
        //    {name: 'Jaan Laan', kt1: 2, kt2: 5, praktiline1: 2, praktiline2: 1, eksam: 4, eksam2: 5},
        //    {name: 'Toomas Koomas', kt1: 5, kt2: 1, praktiline1: 1, praktiline2: 4, eksam: 3, eksam2: 4},
        //    {name: 'Jatsek Pugaslovski', kt1: 5, kt2: 5, praktiline1: 3, praktiline2: 4, eksam: 4, eksam2: 5},
        //    {name: 'Martin Mood', kt1: 1, kt2: 4, praktiline1: 4, praktiline2: 4, eksam: 2, eksam2: 1},
        //    {name: 'Lennart Lest', kt1: 5, kt2: 5, praktiline1: 3, praktiline2: 0, eksam: 4, eksam2: 5},
        //    {name: 'Voldemar Vesi', kt1: 5, kt2: 5, praktiline1: 3, praktiline2: 5, eksam: 1, eksam2: 2},
        //    {name: 'Jaan Tatikas', kt1: 4, kt2: 2, praktiline1: 5, praktiline2: 4, eksam: 4, eksam2: 5},
        //    {name: 'Silver Raba', kt1: 5, kt2: 3, praktiline1: 3, praktiline2: 4, eksam: 5, eksam2: 3},
        //    {name: 'Mats Paat', kt1: 2, kt2: 5, praktiline1: 2, praktiline2: 1, eksam: 4, eksam2: 5},
        //    {name: 'Toomas Vesi', kt1: 5, kt2: 1, praktiline1: 1, praktiline2: 4, eksam: 3, eksam2: 4},
        //    {name: 'Dimitri Kuu', kt1: 5, kt2: 5, praktiline1: 3, praktiline2: 4, eksam: 4, eksam2: 5},
        //    {name: 'Martin Laul', kt1: 1, kt2: 4, praktiline1: 4, praktiline2: 4, eksam: 2, eksam2: 1},
        //    {name: 'Lennart Meri', kt1: 5, kt2: 5, praktiline1: 3, praktiline2: 0, eksam: 4, eksam2: 5}
        //
        //];


        $rootScope.$watch('user', function (user) {
            if ($rootScope.user !== null && $rootScope.user !== undefined && $rootScope.user.role === "USER") {
                $rootScope.showMainFabButton = true;
            }
        }, true);

        $rootScope.$watch(authenticatedUserService.isAuthenticated(), function () {
            if (authenticatedUserService.isAuthenticated() === true) {
                $rootScope.showMainFabButton = true;
            }
        }, true);


    }]);

    return angularAMD.bootstrap(app);
});
