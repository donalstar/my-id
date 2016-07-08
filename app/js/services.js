var services = angular.module('todoService', [])

services.factory('SSN', ['$http', function ($http) {
    return {
        update: function (value) {
            return $http.post('/api/ssn', value);
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


