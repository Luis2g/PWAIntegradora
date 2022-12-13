if(navigator.serviceWorker){
    navigator.serviceWorker.register('./sw.js'); 
}

var hoss = angular.module('hoss',['ngRoute']);

hoss.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: 'https://luis2g.github.io/PWAIntegradora/views/general/principal.html',
            controller: 'principalController'
        })
        .when('/administracion', {
            templateUrl: 'https://luis2g.github.io/PWAIntegradora/views/users/admin/roomAdministration.html',
            controller: 'managerController'
        })
        .when('/login', {
            templateUrl: 'https://luis2g.github.io/PWAIntegradora/views/login.html',
            controller: 'sessionController'
        })
       
}]);
