application.controller('admin_controller', ['$scope', '$rootScope', 'Customer', 'Account', 'SNAP_VERSION', 'snapRemote',
    function ($scope, $rootScope, Customer, Account, SNAP_VERSION, snapRemote) {

        $scope.loggedIn = false;
        $scope.accountCreateInProgress = false;
        $scope.accountBalance = 0.00;

        $scope.customerData = {};
        
        $scope.snapVersion = SNAP_VERSION.full;

        $scope.accountCreateStatus = '';
        $scope.loginFormData = {};
        $scope.fullName = '';

        snapRemote.getSnapper().then(function (snapper) {
            snapper.open('left');
        });

        $scope.logIn = function () {

            Customer.get($scope.customerData.username, $scope.customerData.password)
                .success(function (data) {
                    if (data.result == true) {
                        console.log("Login successful " + data.result + " err " + data.error);

                        $scope.loggedIn = true;
                        $scope.user = $scope.customerData.username;
                        $scope.fullName = data.first_name + ' ' + data.last_name;

                        $scope.accountBalance = data.balance;

                        Account.getAll()
                            .success(function (data) {
                                $scope.accounts = data;
                            })
                            .error(function (error) {
                                console.log("Accounts error " + error);
                            });
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

            Customer.create($scope.accountFormData)
                .success(function (data) {
                    console.log("Updating... success --- using username " + $scope.accountFormData.username);

                    console.log("Created new customer account! - " + data.value);

                    $scope.accountCreateStatus = 'account created!';
                    $scope.accountCreateInProgress = false;
                })
                .error(function (error) {
                    console.log("error creating customer account " + error);

                    $scope.createFailed = true;
                    $scope.accountCreateInProgress = false;
                    $scope.createErrorMessage = error;
                });
        };
    }]);

