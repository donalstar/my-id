var application = angular.module('appname', [
    'ngRoute',
    'service',
    'ui.bootstrap'
]);

application.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'controller'
    }).when('/main', {
        templateUrl: 'partials/main.html',
        controller: 'controller'
    }).when('/admin_home', {
        templateUrl: 'partials/admin_home.html',
        controller: 'admin_controller'
    }).when('/admin_main', {
        templateUrl: 'partials/admin_main.html',
        controller: 'admin_controller'
    }).otherwise({
        redirectTo: '/home'
    });
}]);


application.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

}]);

