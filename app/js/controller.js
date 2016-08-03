application.controller('controller', ['$scope', '$rootScope', '$window', 'Attributes', 'Account',
    '$modal', '$log',
    function ($scope, $rootScope, $window,
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


        $scope.viewDetails = function (item) {
            $scope.selectedItem = item;

            var modalInstance = $modal.open({
                templateUrl: '/partials/attribute_view.html',
                backdrop: false,
                scope: $scope,
                controller: 'modalController',
                size: 'md'
            });


            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.addItem = function (item) {
            $scope.selectedItem = item;

            var modalInstance = $modal.open({
                templateUrl: '/partials/attribute_add.html',
                backdrop: false,
                scope: $scope,
                controller: 'modalController',
                size: 'md'
            });


            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.accountCreateInProgress = false;
        $rootScope.accountCreateSuccess = false;

        $rootScope.accountTokens = 0;

        $scope.loginFormData = {};

        $scope.accountFormData = {};

        $scope.assigned_attributes = [];

        $scope.accountCreateStatus = '';

        $scope.dataUpdateInProgress = false;
        $scope.updateStatus = '';


        $scope.showLogin = true;

        $scope.showAttributes = false;

        $rootScope.attributesLoaded = false;


        $scope.logIn = function () {
            $scope.loadAccountData($scope.loginFormData.username, $scope.loginFormData.password, true);
        };

        $scope.init_main = function () {
            if ($rootScope.loggedIn == undefined) {
                $scope.setLoginStatus();
            }
        };

        $scope.setLoginStatus = function () {
            Account.checkLogin()
                .success(function (result) {

                    $rootScope.loggedIn = result.logged_in;

                    if (!$rootScope.loggedIn) {
                        $window.location.href = '#home';
                    }
                    else {
                        console.log("User " + result.username + " logged in");

                        $scope.loadAccountData(result.username, $scope.loginFormData.password, false);
                    }
                })
                .error(function (error) {
                    console.log(":Error checking login status " + error);
                });
        };

        $scope.loadAccountData = function ($username, $password, dismiss_dialog) {
            Account.get($username, $password)
                .success(function (data) {
                    // if (data.result == true) {

                    console.log("Account get successful!");

                    if ($rootScope.attributesLoaded == false) {
                        console.log("Login successful " + data.result + " err " + data.error);

                        $rootScope.loggedIn = true;


                        $rootScope.user = $scope.loginFormData.username;

                        $rootScope.fullName = data.first_name + ' ' + data.last_name;

                        $rootScope.accountBalance = data.balance;

                        $rootScope.attributes = {};
                        $rootScope.attributes.profile = data.profile;

                        $rootScope.attributesLoaded = true;

                        window.location = "#main";

                       if (dismiss_dialog == true) {
                            $scope.ok();
                       }
                    }
                    else {
                        console.log("Login error " + data.error);
                        $scope.loginFailed = true;
                        $scope.loginErrorMessage = data.error;
                    }
                })
                .error(function (error) {
                    console.log(":Error logging in " + error);

                    $scope.loginFailed = true;
                    $scope.loginErrorMessage = error.message;
                });
        };

        $scope.toggleAttributesPanel = function () {
            $scope.showAttributes = !$scope.showAttributes;
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

        $scope.getValues = function (key) {
            var result;

            var value_attributes = attributes.getValueAttributes();

            for (index in value_attributes) {
                var value = value_attributes[index];

                if (value.name == key.toLowerCase()) {
                    result = value.values;
                }
            }

            return result;
        };

        $scope.getAttributes = function () {
            var result = [];

            if ($scope.all_attributes == undefined) {

                if ($scope.attributes != undefined) {
                    for (index in $scope.attributes.profile) {
                        if (index % 3 == 0) {
                            var row = [];

                            result.push(row);
                        }

                        $scope.assigned_attributes.push($scope.attributes.profile[index].name);

                        row.push($scope.attributes.profile[index]);
                    }

                    $scope.all_attributes = result;
                }

            }
            else {
                result = $scope.all_attributes;
            }

            return result;
        };

        $scope.getRemainingAttributes = function () {
            var result = [];

            // start with all attribs
            if ($scope.remaining_attributes == undefined) {
                var values = attributes.getValueAttributes();

                for (index in values) {
                    if (index % 3 == 0) {
                        var row = [];

                        result.push(row);
                    }

                    if (!$scope.attributeIsAssigned(values[index])) {
                        row.push(values[index]);
                    }
                }

                $scope.remaining_attributes = result;
            }

            return $scope.remaining_attributes;
        };

        $scope.attributeIsAssigned = function (value) {
            return ($scope.assigned_attributes.indexOf(value.name) != -1);
        };

        $scope.addValue = function (type, value, line2) {
            console.log("Add value " + type + " line2: " + line2);

            var attributes = $scope.attributes.profile;

            attributes.push({name: type, value: value, line2: line2, access: 0});

            $scope.setValues(type, attributes);
        };

        $scope.updateValues = function (type) {
            $scope.setValues(type, $scope.attributes.profile);
        };

        $scope.setValues = function (type, attributes) {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.attributes != undefined) {
                $scope.loading = true;

                $scope.dataUpdateInProgress = true;

                // $scope.attributes.user = $scope.user;
                // $scope.attributes.requestType = type;

                var request_data = {};

                request_data.user = $scope.user;
                request_data.requestType = type;
                request_data.profile = attributes;

                // call the create function from our service (returns a promise object)
                Attributes.update(request_data)

                // if successful creation, call our get function to get all the new todos
                    .success(function (data) {
                        console.log("Updating... success -- new balance " + data.balance);

                        $rootScope.accountBalance = data.balance;

                        $scope.loading = false;

                        $scope.updateStatus = "update successful";

                        $scope.dataUpdateInProgress = false;

                        $scope.loadAccountData($scope.user, $scope.loginFormData.password, true);

                    })
                    .error(function (error) {
                        $scope.updateStatus = "Update error: " + error.message;

                        $scope.dataUpdateInProgress = false;

                        $scope.ok();
                    });
            }
        };
    }])
;


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

