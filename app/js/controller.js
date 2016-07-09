application.controller('controller', ['$scope', '$rootScope', 'SSN', 'Account', 'SNAP_VERSION', 'snapRemote',
    function ($scope, $rootScope, SSN, Account, SNAP_VERSION, snapRemote) {

        $scope.loggedIn = false;
        $scope.accountCreateInProgress = false;

        $scope.loginFormData = {};

        $scope.formData = {};

        $scope.accountFormData = {};

        $scope.snapVersion = SNAP_VERSION.full;

        $scope.accountCreateStatus = '';

        $scope.dataUpdateInProgress = false;
        $scope.ssnUpdateStatus = '';

        $scope.fullName = '';

        snapRemote.getSnapper().then(function (snapper) {
            snapper.open('left');
        });

        $scope.logIn = function () {

            Account.get($scope.loginFormData.username, $scope.loginFormData.password)
                .success(function (data) {
                    if (data.result == true) {
                        console.log("Login successful " + data.result + " err " + data.error);

                        $scope.loggedIn = true;
                        $scope.user = $scope.loginFormData.username;
                        $scope.fullName = data.first_name + ' ' + data.last_name;

                        $scope.ssn = data.ssn;

                        console.log("SSN " + $scope.ssn);

                        $scope.formData.text = data.value;
                    }
                    else {
                        console.log("Login error " + data.error);
                        $scope.loginFailed = true;
                        $scope.loginErrorMessage = data.error;
                    }
                })
                .error(function (error) {
                    console.log(":Error logging in " + error);
                });

        };

        $scope.createAccount = function () {
            console.log("Create account... ");

            $scope.accountCreateInProgress = true;

            Account.create($scope.accountFormData)
                .success(function (data) {
                    console.log("Updating... success --- using username " + $scope.accountFormData.username);

                    console.log("Created new account! - " + data.value);

                    $scope.accountCreateStatus = 'account created!';
                    $scope.accountCreateInProgress = false;
                });
        };

        $scope.updateValue = function () {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.formData != undefined) {
                $scope.loading = true;

                $scope.dataUpdateInProgress = true;
           
                $scope.formData.user = $scope.user;

                console.log("Updating... ");

                // call the create function from our service (returns a promise object)
                SSN.update($scope.formData)

                // if successful creation, call our get function to get all the new todos
                    .success(function (data) {
                        console.log("Updating... success");

                        $scope.loading = false;

                        $scope.ssn = $scope.formData.text;

                        $scope.ssnUpdateStatus = "update successful";

                        $scope.dataUpdateInProgress = false;
                    });
            }
        };
    }]);

