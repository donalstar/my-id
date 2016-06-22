application.controller('controller', ['$scope', '$rootScope', 'SSN', 'Value', 'SNAP_VERSION', 'snapRemote',
    function($scope, $rootScope, SSN, Value, SNAP_VERSION, snapRemote ) {

    $scope.formData = {};


    SSN.get(1)
    	.success(function(data) {
		$scope.ssn = data.a;

		console.log("SSN " + $scope.ssn);
	});

    Value.get(1)
    	.success(function(data) {
		$scope.value = data.value;

		$scope.formData.text = data.value;
	});

    $scope.snapVersion = SNAP_VERSION.full;

    snapRemote.getSnapper().then(function(snapper) {
        snapper.open('left');
    });

	$scope.updateValue = function() {

		// validate the formData to make sure that something is there
		// if form is empty, nothing will happen
		if ($scope.formData != undefined) {
			$scope.loading = true;

			// call the create function from our service (returns a promise object)
			Value.update($scope.formData)

				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.todos = data; // assign our new list of todos
				});
		}
	};
}]);

