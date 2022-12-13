hoss.controller('navbarController', ['$scope', '$location', function($scope, $location) {

    $scope.switch = {
        toMainView: () => {
            $location.path('/');
        },
        toLandingPage: () => {
            $location.path('/landingPage');
        },
        toUserRegistration: () => {
            $location.path('/userRegistration');
        },
        toLogin: () => {
            localStorage.clear();
            window.location.replace('/login');
        },
    };

}]);