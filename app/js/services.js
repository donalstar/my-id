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
        getData: function (username, account_name, attribute) {
            return $http.get('/api/account_data/' + username + "/" + account_name + "/" + attribute);
        },

        getBalances: function () {
            return $http.get('/api/coinbank/');
        },

        getAll: function () {
            return $http.get('/api/accounts/');
        },
        create: function (value) {
            return $http.post('/api/account', value);
        }
    }
}]);

services.factory('Customer', ['$http', function ($http) {
    return {
        get: function (username, password) {
            return $http.get('/api/customer/' + username + "/" + password);
        },
        create: function (value) {
            return $http.post('/api/customer', value);
        }
    }
}]);




