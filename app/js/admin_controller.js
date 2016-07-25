application.controller('admin_controller', ['$scope', '$rootScope', 'Customer', 'Account', 'SNAP_VERSION', 'snapRemote',
    function ($scope, $rootScope, Customer, Account, SNAP_VERSION, snapRemote) {

        $scope.loggedIn = false;
        $scope.accountCreateInProgress = false;
        $scope.queryInProgress = false;
        $scope.queryStatus = '';
        $scope.accountBalance = 0.00;
        $scope.accountTokens = 0;
        $scope.customerData = {};

        $scope.snapVersion = SNAP_VERSION.full;

        $scope.accountCreateStatus = '';
        $scope.loginFormData = {};
        $scope.fullName = '';

        $scope.accountAttributes = {};

        $scope.showLogin = true;
        $scope.showSignUp = false;

        $scope.accountBalances = {};

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

                        $scope.accountTokens = data.tokens;

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

            Account.getBalances()
                .success(function (data) {
                    $scope.accountBalances = data;
                })
                .error(function (error) {
                    console.log(":Error getting account balances " + error);
                });
        };

        $scope.doSignUp = function (show) {
            if (show == true) {
                console.log("Sign Up!");

                $scope.showLogin = false;
                $scope.showSignUp = true;
            }
            else {
                $scope.showLogin = true;
                $scope.showSignUp = false;
            }
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

                    $scope.doSignUp(false);
                })
                .error(function (error) {
                    console.log("error creating customer account " + error);

                    $scope.createFailed = true;
                    $scope.accountCreateInProgress = false;
                    $scope.createErrorMessage = error;
                });
        };

        $scope.requestData = function (account_name) {
            console.log("REQUEST DATA for " + account_name);

            $scope.queryInProgress = true;

            Account.getData($scope.user, account_name, "attrib")
                .success(function (data) {
                    console.log("Got account data " + data.value);

                    $scope.accountAttributes[account_name] = data.value;

                    $scope.accountBalance = data.balance;

                    $scope.accountTokens = data.token_balance;

                    $scope.queryInProgress = false;
                    $scope.queryStatus = '';
                })
                .error(function (error) {
                    console.log("error getting account data " + error);

                    $scope.queryInProgress = false;
                    $scope.queryStatus = 'error...' + error;
                });
        };

        $scope.gotAttribute = function (username) {
            return $scope.accountAttributes[username];
        }
    }]);

