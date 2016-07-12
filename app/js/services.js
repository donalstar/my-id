var services = angular.module('service', []);

services.factory('Attributes', ['$http', function ($http) {
    return {
        update: function (value) {
            return $http.post('/api/attribute', value);
        }
    }
}]);

services.factory('Account', ['$http', function ($http) {
    return {
        get: function (username, password) {
            return $http.get('/api/account/' + username + "/" + password);
        },
        create: function (value) {
            return $http.post('/api/account', value);
        }
    }
}]);


