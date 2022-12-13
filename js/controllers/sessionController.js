hoss.controller('sessionController', ['$scope', '$http', 
function($scope, $http) {
    
    $http.defaults.headers.post["Content-Type"] = "application/json";
    const urlService = 'https://hossservices-production.up.railway.app/api/';
    $scope.user = "";

    
    (() => {
        $http({
            method: "GET",
            url: urlService + 'userProfile',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem("access-token")}`,
                'Accept': 'application/json'
            }
        }).then( response => {
            $scope.user = response.data.data          
        }).catch( err => {
            console.log('There has been an error trying to get the session from the memory ', err);
        });
    })();


    $scope.user = {};

    $scope.switch = {
        toMainView: () => {
            $location.path('./');
        },
        toLandingPage: () => {
            $location.path('/landingPage');
        },
        toUserRegistration: () => {
            $location.path('/userRegistration');
        },
        toLogin: () => {
            localStorage.clear();
            window.location.replace('./login');
        },
    };
    
    $scope.login = () => {

        $http({
            method: "POST",
            url: urlService + 'login',
            params: { email: $scope.user.email, password: $scope.user.password }
        }).then( response => {         

            localStorage.setItem("access-token", response.data.access_token);

            $http({
                method: "GET",
                url: urlService + 'userProfile',
                headers: { 
                    'Authorization': `Bearer ${response.data.access_token}`,
                    'Accept': 'application/json'
                }
            }).then( response => {
    
                if(response.data.data.role_id === 2){
                    window.location.replace("./");
                }else{
                    window.location.replace("./#!/administracion");
                }
    
            }).catch( err => {
                console.log('There has been an error trying to get the info user ', err);
            });

        }).catch( err => {
            console.log('There has been an error trying to log in', err);
            swal({
                title: "Ops!",
                text: "Correo y/o contraseña incorrecta",
                icon: "error"
            });
        });
    }

    $scope.logout = () => {
        localStorage.clear();
        window.location.replace('./login');
    }

}])