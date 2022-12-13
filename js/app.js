if(navigator.serviceWorker){
    navigator.serviceWorker.register('./sw.js'); 
}

var hoss = angular.module('hoss',['ngRoute']);

hoss.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: '/PWAIntegradora/views/general/principal.html',
            controller: 'principalController'
        })
        .when('/administracion', {
            templateUrl: '/PWAIntegradora/views/users/admin/roomAdministration.html	',
            controller: 'managerController'
        })
        .when('/login', {
            templateUrl: '/PWAIntegradora/login.html	',
            controller: 'sessionController'
        })
       
}]);
