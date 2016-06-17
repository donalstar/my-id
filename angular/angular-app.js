var application = angular.module('appname', ['snap']);


application.config(['$httpProvider',function ($httpProvider) {
 $httpProvider.defaults.useXDomain = true;
 delete $httpProvider.defaults.headers.common["X-Requested-With"];
 $httpProvider.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

}]) ;

application.factory('dataFactory', ['$http', function($http) {
    var dataFactory = {};

    dataFactory.execute = function (cust) {

         return $http.post(apiUrl, cust);
    };

    return dataFactory;
}]);

application.controller('controller', ['$scope', 'dataFactory', 'SNAP_VERSION', 'snapRemote',
    function($scope, dataFactory, SNAP_VERSION, snapRemote ) {




    $scope.active_status = [
        "Active",
        "Inactive"
    ];


    $scope.teams = [
        "Alpha",
        "Bravo",
        "Delta",
        "Foxtrot"
    ];

    $scope.bases = [
        "SEA",
        "SFO",
        "DEN",
        "OAK"
    ];



    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    $scope.markers = [];


    $scope.snapVersion = SNAP_VERSION.full;

    $scope.doAdd = false;
    $scope.doShow = true;

    snapRemote.getSnapper().then(function(snapper) {
        snapper.open('left');
    });

    $scope.addItem = function() {
        insertData($scope.member);
    };


    $scope.changeItem = function(member) {
        editMember(member);
    };

    $scope.deleteItem = function(member) {
        deleteMember(member);
    };

    $scope.refresh = function() {
        getMembers();
    };

    getMembers();

    $scope.show = function(member) {
        $scope.selectedMember = member;

        console.log("show " + member.Name);
        $scope.doShow = true;
        $scope.doAdd = false;

        snapRemote.getSnapper().then(function(snapper) {
            snapper.open('right');
        });
    }

    $scope.add = function() {
        $scope.doAdd = true;
        $scope.doShow = false;

        snapRemote.getSnapper().then(function(snapper) {
            snapper.open('right');
        });
    }

    // Get from AWS Dynamo DB
    function getMembers() {


    }

    function refreshMapMarkers() {

    }

    // Insert in AWS Dynamo DB
    function insertData(member) {

        member.ID = ($scope.members.length + 1).toString();

        index = getRandom(0, 3);

        member.Latitude = String(locs[index].lat);
        member.Longitude = String(locs[index].long);

        var payload = {
            Item: member
        };

        var data = {
            operation: 'create',
            tableName: member_table,
            payload: payload
        };

        dataFactory.execute(data)
            .then(function (response) {
               console.log("Inserted Customer " + response.data);

                $scope.status = response.data;

                getMembers();

                snapRemote.getSnapper().then(function(snapper) {
                    snapper.open('left');
                });
            }, function(error) {
                $scope.status = 'Unable to insert customer: ' + error.message;
            });
    };

    // Delete from AWS Dynamo DB
    function deleteMember(member) {

        var keys = {
            ID: member.ID,
            Name: member.Name
        };


        var payload = {
            Key: keys
        };

        var data = {
            operation: 'delete',
            tableName: member_table,
            payload: payload
        };

        dataFactory.execute(data)
            .then(function (response) {
               console.log("Deleted member " + response.data);

                $scope.status = response.data;

                getMembers();

                snapRemote.getSnapper().then(function(snapper) {
                    snapper.open('left');
                });
            }, function(error) {
                $scope.status = 'Unable to delete member: ' + error.message;
            });
    };

    // Edit from AWS Dynamo DB item
    function editMember(member) {

console.log("updating team to " + member.Team + " for id " + member.ID);
        var keys = {
            ID: member.ID,
            Name: member.Name
        };

        var values = {
            ':active': member.Active,
            ':team': member.Team,
            ':base': member.Base
        };

        var names = {
            '#b': 'Base'
        };

        var payload = {
            Key: keys,
            UpdateExpression: "set Active = :active, Team = :team, #b = :base",
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values
        };

        var data = {
            operation: 'update',
            tableName: member_table,
            payload: payload
        };

        dataFactory.execute(data)
            .then(function (response) {
               console.log("Updated member " + response.data);

                $scope.status = response.data;

                getMembers();

                snapRemote.getSnapper().then(function(snapper) {
                    snapper.open('left');
                });
            }, function(error) {
                $scope.status = 'Unable to update item: ' + error.message;
            });
    };
}]);

