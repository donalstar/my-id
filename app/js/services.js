var services = angular.module('todoService', [])

services.factory('SSN', ['$http', function ($http) {
    return {
        get: function (id) {
            return $http.get('/api/ssn/' + id);
        },
        update: function (value) {
            return $http.post('/api/ssn', value);
        }
    }
}]);

services.factory('Account', ['$http', function ($http) {
    return {

        create: function (value) {
            return $http.post('/api/account', value);
        }
    }
}]);


