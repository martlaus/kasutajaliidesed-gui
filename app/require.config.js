require.config({
    baseUrl: './',
    paths: {
        'requirejs': 'libs/requirejs/require',
        'angular': 'libs/angular/angular.min',
        'angularAMD': 'libs/angularAMD/angularAMD.min',
        'ngload': 'libs/angularAMD/ngload.min',
        'angular-animate': 'libs/angular-animate/angular-animate.min',
        'angular-aria': 'libs/angular-aria/angular-aria.min',
        'angular-click-outside': 'libs/angular-click-outside/clickoutside.directive',
        'angular-material': 'libs/angular-material/angular-material.min',
        'angular-resource': 'libs/angular-resource/angular-resource.min',
        'angular-route': 'libs/angular-route/angular-route.min',
        'angular-translate': 'libs/angular-translate/angular-translate.min',
        'angular-messages': 'libs/angular-messages/angular-messages.min',
        'angular-translate-loader-url': 'libs/angular-translate-loader-url/angular-translate-loader-url.min',
        'angular-youtube-mb': 'libs/angular-youtube-mb/dist/angular-youtube-embed.min',
        'angular-screenfull': 'libs/angular-screenfull/dist/angular-screenfull.min',
        'angular-scroll': 'libs/angular-scroll/angular-scroll',
        'angular-material-data-table': 'libs/angular-material-data-table/dist/md-data-table.min',
        'screenfull': 'libs/screenfull/dist/screenfull',
        'jsog': 'libs/jsog/lib/JSOG',
        'ngInfiniteScroll': 'libs/ngInfiniteScroll/build/ng-infinite-scroll.min',
        'jquery': 'libs/jquery/dist/jquery.min',
        'ng-file-upload': 'libs/ng-file-upload/ng-file-upload.min',
        'clipboard': 'libs/clipboard/dist/clipboard.min'
    },
    shim: {
        'angular': ['jquery'],
        'angularAMD': ['angular'],
        'ngload': ['angularAMD'],
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-material': [
            'angular-animate',
            'angular-aria'
        ],
        'angular-translate': ['angular'],
        'angular-messages': ['angular'],
        'angular-translate-loader-url': ['angular-translate'],
        'angular-route': ['angular'],
        'angular-youtube-mb': ['angular'],
        'angular-resource': ['angular'],
        'angular-material-icons': ['angular'],
        'angular-screenfull': [
            'angular',
            'screenfull'
        ],
        'angular-scroll': ['angular'],
        'ng-file-upload': ['angular'],
        'angular-click-outside': ['angular'],
        'angular-material-data-table': [
            'angular-material',
            'angular'
        ],
        'ngInfiniteScroll': [
            'angular',
            'jquery'
        ]
    },
    deps: ['app']
});
