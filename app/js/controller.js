application.controller('controller', ['$scope', '$rootScope', 'SSN', 'Account',  'SNAP_VERSION', 'snapRemote',
    function ($scope, $rootScope, SSN, Account, SNAP_VERSION, snapRemote) {

        $scope.loggedIn = false;

        $scope.formData = {};

        $scope.accountFormData = {};
        
        SSN.get(1)
            .success(function (data) {
                $scope.ssn = data.value;

                console.log("SSN " + $scope.ssn);

                $scope.formData.text = data.value;
            });

        $scope.snapVersion = SNAP_VERSION.full;

        snapRemote.getSnapper().then(function (snapper) {
            snapper.open('left');
        });

        $scope.logIn = function() {
            console.log("Log in... ");

            $scope.loggedIn = true;
        };

        $scope.createAccount = function() {
            console.log("Create account... ");

            Account.create($scope.accountFormData)
                .success(function (data) {
                    console.log("Updating... success --- using password " + $scope.accountFormData.text);

                    console.log("Created new account! - " + data.value);
                });
        };

        $scope.updateValue = function () {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.formData != undefined) {
                $scope.loading = true;

                console.log("Updating... ");

                // call the create function from our service (returns a promise object)
                SSN.update($scope.formData)

                // if successful creation, call our get function to get all the new todos
                    .success(function (data) {
                        console.log("Updating... success");

                        $scope.loading = false;

                        $scope.ssn = $scope.formData.text;
                    });
            }
        };
    }]);

