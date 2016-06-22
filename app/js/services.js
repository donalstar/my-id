var services = angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	services.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}
		}
	}]);

	services.factory('SSN', ['$http',function($http) {
		return {
			get : function(id) {
				return $http.get('/api/ssn/' + id);
			}
		}
	}]);

	services.factory('Value', ['$http',function($http) {
		return {
			get : function(id) {
				return $http.get('/api/value/' + id);
			},
			update : function(value) {
				return $http.post('/api/value', value);
			},
		}
	}]);


