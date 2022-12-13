if(navigator.serviceWorker){
    navigator.serviceWorker.register('./sw.js'); 
}

var hoss = angular.module('hoss',['ngRoute']);

hoss.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: '/views/general/principal.html',
            controller: 'principalController'
        })
        .when('/administracion', {
            templateUrl: '/views/users/admin/roomAdministration.html',
            controller: 'managerController'
        })
        .when('/login', {
            templateUrl: './views/login.html',
            controller: 'sessionController'
        })
       
}]);
