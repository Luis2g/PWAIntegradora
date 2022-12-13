hoss.controller('managerController', ['$scope', '$http', '$location', function($scope,$http, $location) {

    const formator = new Intl.DateTimeFormat('es-MX', { dateStyle: 'full', timeStyle: 'medium' });
    const urlService = 'http://127.0.0.1:8000/api/';

    (() => {
        $http({
            method: "GET",
            url: urlService + 'userProfile',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem("access-token")}`,
                'Accept': 'application/json'
            }
        }).then( response => {
            $scope.maid = response.data.data

        }).catch( err => {
            console.log('There has been an error trying to get the session from the memory ', err);
            location.replace('/login');
        });
    })();



    $scope.consultarTodasLasHabitaciones = () => {
        $http({
            method: 'GET',
            url: urlService + 'rooms/index',
            headers:{"Accept":"application/json, text/plain, */*"}
        }).then(response => {
            $scope.habitaciones = response.data.data;
        }).catch( err => {
            console.log('There has been an error trying to recover the rooms error -> ', err);
        });
    }

    $scope.maskAs = (habitacion, estado) => {

        let varStatus = '';
        switch(estado){
            case 3:
                varStatus = 'Disponible';
                break;
            case 5: 
                varStatus = 'Sucio';
                break;
            case 7: 
                varStatus = 'Ocupada';
                break;
            case 4:
                varStatus = 'Limpia'; 
        }


        let log = {
            userId: $scope.maid.id,
            roomId: habitacion.id,
            status: varStatus,
            dataAndHour: formator.format(new Date())
        };

        $http({
            method: 'PUT',
            url: urlService + `rooms/update/${habitacion.id}`,
            data: { log: log, room : {...habitacion, status_id: estado }},
            headers: { "Accept": "application/json, text/plain, */*" }
        }).then( () => {
            habitacion.status_id = estado;
            toastify();
        }).catch(err => {
            console.log('There has been an error trying to update a room -> ', err);
        });
    }

    const toastify = () => {
        Toastify({
            text: "Cambios guardados",
            duration: 3500,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #2EE847, #54F230)",
            }
        }).showToast();
    };

}]);