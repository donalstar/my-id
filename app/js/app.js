var application = angular.module('appname', [
    'service',
    'snap'
]);

application.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

}]);



