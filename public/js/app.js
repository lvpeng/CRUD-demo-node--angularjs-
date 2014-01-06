'use strict';

/* App Module */

angular.module('ngResourceDemo', ['controllers']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user-list', {templateUrl: 'userList.html', controller: 'UserListCtrl'});
        $routeProvider.when('/user-edit/:id', {templateUrl: 'userEdit.html', controller: 'UserDetailCtrl'});
        $routeProvider.when('/user-creation', {templateUrl: 'userCreation.html', controller: 'UserCreationCtrl'});
        $routeProvider.otherwise({redirectTo: '/user-list'});
    }]);








