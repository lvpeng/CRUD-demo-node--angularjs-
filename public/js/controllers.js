'use strict';

var resource_app = angular.module('ngResourceDemo', ['ngResource']);

resource_app.config(function ($routeProvider) {
    $routeProvider.when('/user-list', {templateUrl: 'partials/userList.html', controller: 'UserListCtrl'});
    $routeProvider.when('/user-edit/:userId', {templateUrl: 'partials/userEdit.html', controller: 'UserDetailCtrl'});
    $routeProvider.when('/user-creation', {templateUrl: 'partials/userCreation.html', controller: 'UserCreationCtrl'});
    $routeProvider.otherwise({redirectTo: '/user-list'});
});

resource_app.factory('userList', ['$resource', function($resource) {
    return $resource('/api/users/:userId/',
        null,
        {update: { method:'PUT'}}
    )}
   ]);


//var userControllers = angular.module('userControllers', []);
resource_app.controller('UserListCtrl', function(userList, $scope, $location,$route) {
    $scope.users = userList.query();


    //delete User
    $scope.deleteUser = function(userId) {
        userList.delete({userId:userId});
        //window.location.reload();
        $route.reload();    // refresh page after delete operation
    }
    //edit User
    $scope.editUser = function(userId){
        $location.path('/user-edit/'+ userId);
    }
    //create new  User
    $scope.createNewUser = function(){
        //redirect to /user-creation
        $location.path('/user-creation');
    }
});


resource_app.controller('UserDetailCtrl', function(userList, $scope, $routeParams, $location) {

    //console.log($routeParams.userId);  //get the route Parameter
    $scope.user = userList.get({userId: $routeParams.userId});
    //console.log($scope.user);

    //update User
    $scope.updateUser = function(id) {
        //console.log('userId:' + id);
        userList.update({userId:id}, $scope.user);

        $location.path('/user-list');
    }
});

// In our controller we get the ID from the URL using ngRoute and $routeParams
// We pass in $routeParams and our Users factory along with $scope
//resource_app.controller('UserDetailCtrl', ['$scope', '$routeParams', '$location', 'userList' ,
//    function($scope, $routeParams, $location , userList) {
//        $scope.updateUser = function(userId){
//            // First get a user object from the factory
//            var user = userList.get({ userId:userId });
//            console.log(user);
//
//            // Now call update passing in the ID first then the object you are updating
//            userList.update({ userId:userId },user);
//            $location.path('/user-list');
//            // This will PUT /users/ID with the user object in the request payload
//        }
//
//    }]);


resource_app.controller('UserCreationCtrl',function(userList,$scope,$location){
    $scope.createNewUser = function(){
        userList.save({},$scope.user);
        $location.path('/user-list');
    }
});

