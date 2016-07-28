application.controller('controller', ['$scope', '$rootScope', 'Attributes', 'Account',
    '$modal', '$log',
    function ($scope, $rootScope,
              Attributes, Account, $modal, $log) {

        $scope.openSignIn = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'signIn',
                controller: 'modalController',
                size: size
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.openSignUp = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'signUp',
                controller: 'modalController',
                size: size
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.accountCreateInProgress = false;
        $rootScope.accountCreateSuccess = false;

        $scope.loginFormData = {};

        $scope.accountFormData = {};

        $scope.accountCreateStatus = '';

        $scope.dataUpdateInProgress = false;
        $scope.updateStatus = '';


        $scope.showLogin = true;
        $scope.showSignUp = false;

        $scope.logIn = function () {

            Account.get($scope.loginFormData.username, $scope.loginFormData.password)
                .success(function (data) {
                    if (data.result == true) {
                        console.log("Login successful " + data.result + " err " + data.error);

                        $rootScope.loggedIn = true;

                        $rootScope.user = $scope.loginFormData.username;
                        $rootScope.fullName = data.first_name + ' ' + data.last_name;

                        $rootScope.accountBalance = data.balance;

                        $rootScope.attributes = {};
                        $rootScope.attributes.profile = data.profile;

                        window.location = "#main";

                        $scope.ok();
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

        $scope.showAdmin = function () {
            window.location = "#admin_home";
        };

        $scope.showSignUpDialog = function () {
            $scope.cancel();
            $scope.openSignUp();
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
                    $rootScope.accountCreateSuccess = true;

                    $scope.ok();
                }).error(function (error) {
                $scope.accountCreateStatus = "Create error: " + error.message;

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

                        $rootScope.accountBalance = data.balance;

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


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

application.controller('modalController', function ($scope, $modalInstance) {


    $scope.ok = function () {
        console.log("OK!!");
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

