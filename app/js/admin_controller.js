application.controller('admin_controller', ['$scope', '$rootScope', 'Customer', 'Account',
    '$modal', '$log',
    function ($scope, $rootScope, Customer, Account, $modal, $log) {


        $scope.accountCreateInProgress = false;
        $scope.queryInProgress = false;

        $scope.queryStatus = '';

        $scope.customerData = {};

        $scope.accountCreateStatus = '';
        $scope.loginFormData = {};

        $scope.accountAttributes = {};

        $scope.showLogin = true;
        $scope.showSignUp = false;



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


        $scope.logIn = function () {

            Customer.get($scope.customerData.username, $scope.customerData.password)
                .success(function (data) {
                    if (data.result == true) {
                        console.log("Login successful " + data.result + " err " + data.error);

                        $rootScope.loggedIn = true;
                        $rootScope.user = $scope.customerData.username;
                        $rootScope.fullName = data.first_name + ' ' + data.last_name;

                        $rootScope.accountBalance = data.balance;

                        $rootScope.accountTokens = data.tokens;

                        Account.getAll()
                            .success(function (data) {
                                $rootScope.accounts = data;


                                window.location = "#admin_main";

                                $scope.ok();
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
                    $rootScope.accountBalances = data;
                })
                .error(function (error) {
                    console.log(":Error getting account balances " + error);
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

                    window.location = "#admin_home";

                    $scope.ok();
                })
                .error(function (error) {
                    console.log("error creating customer account " + error);

                    $scope.createFailed = true;
                    $scope.accountCreateInProgress = false;
                    $scope.createErrorMessage = error;
                });
        };

        $scope.getTokenBalance = function(username) {
            var balance = null;

            var tokenBalances = $rootScope.accountBalances;

            for (var index in tokenBalances) {
                var item = tokenBalances[index];
                
                if (item.account.username == username) {
                    balance = item.tokens;
                }
            }
            
            return balance;
        };

        $scope.userQueryInProgress = function(account_name) {
            return $scope.queryInProgress && (account_name == $scope.queryAccount);
        };

        $scope.requestData = function (account_name) {
            console.log("REQUEST DATA for " + account_name);

            $scope.queryInProgress = true;
            $scope.queryAccount = account_name;

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

