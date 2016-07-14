application.controller('controller', ['$scope', '$rootScope', 'Attributes', 'Account', 'SNAP_VERSION', 'snapRemote',
    function ($scope, $rootScope, Attributes, Account, SNAP_VERSION, snapRemote) {

        $scope.loggedIn = false;
        $scope.accountCreateInProgress = false;
        $scope.accountBalance = 0.00;

        $scope.loginFormData = {};

        $scope.attributes = {};

        $scope.accountFormData = {};

        $scope.snapVersion = SNAP_VERSION.full;

        $scope.accountCreateStatus = '';

        $scope.dataUpdateInProgress = false;
        $scope.updateStatus = '';

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

                        $scope.accountBalance = data.balance;

                        $scope.attributes.profile = data.profile;
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

        $scope.updateValues = function (type) {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.attributes != undefined) {
                $scope.loading = true;

                $scope.dataUpdateInProgress = true;

                $scope.attributes.user = $scope.user;
                $scope.attributes.requestType = type;

                // call the create function from our service (returns a promise object)
                Attributes.update($scope.attributes)

                // if successful creation, call our get function to get all the new todos
                    .success(function (data) {
                        console.log("Updating... success -- new balance " + data.balance);

                        $scope.accountBalance = data.balance;

                        $scope.loading = false;

                        $scope.updateStatus = "update successful";

                        $scope.dataUpdateInProgress = false;
                    })
                    .error(function (error) {
                        $scope.updateStatus = "Update error: " + error.message;

                        $scope.dataUpdateInProgress = false;
                    });
            }
        };
    }]);

