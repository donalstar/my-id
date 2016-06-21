application.controller('controller', ['$scope', '$rootScope', 'Todos', 'SSN', 'SNAP_VERSION', 'snapRemote',
    function($scope, $rootScope, Todos, SSN, SNAP_VERSION, snapRemote ) {

    Todos.get()
	.success(function(data) {
		$scope.todos = data;
		$scope.loading = false;
	});

    SSN.get(1)
    	.success(function(data) {
		$scope.ssn = data.a;

		console.log("SSN " + $scope.ssn);
	});

    $scope.balance = '777';

    $scope.snapVersion = SNAP_VERSION.full;

    snapRemote.getSnapper().then(function(snapper) {
        snapper.open('left');
    });

    $scope.dl = getDL();

    function getDL() {
        return "DL123";
    }

}]);

