hoss.controller('principalController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $http.defaults.headers.post["Content-Type"] = "application/json";


    $scope.habitaciones = [];
    $scope.incident = {};
    $scope.maid = {};
    const formator = new Intl.DateTimeFormat('es-MX', { dateStyle: 'full', timeStyle: 'medium' });
    const video = document.getElementById("video");
    let pictureContainer = document.getElementById('pictureContainer');
    $scope.showCamera = false;
    $scope.photoStillToBeToken = true;
    $scope.logs = [];
    $scope.appOffline = false;
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

            consultarHabitacionesRecamarera()
        }).catch( err => {
            console.log('There has been an error trying to get the session from the memory ', err);
            location.replace('/login');
        });
    })();


    const consultarHabitacionesRecamarera = () => {

        $http({
            method: 'GET',
            url: urlService + `chamberMaidRooms/show/${$scope.maid.id}`,
            headers: { "Accept": "application/json, text/plain, */*" }
        }).then(response => {
            $scope.habitaciones = response.data.data;
        }).catch(err => {
            console.log('There has been an error trying to recover the rooms error -> ', err);
        });
    }

    $scope.maskAs = ( habitacion, status ) => {

        let varStatus = '';
        switch(status){
            case 4:
                varStatus = 'Limpia';
                break;
            case 8: 
                varStatus = 'Bloqueada';
        }

        let log = {
            userId: $scope.maid.id,
            roomId: habitacion.id,
            status: "Limpia",
            dataAndHour: formator.format(new Date())
        };

        $http({
            method: 'PUT',
            url: urlService + `rooms/update/${habitacion.id}`,
            data: { log: log, room:{ ...habitacion, status_id: status }},
            headers: { "Accept": "application/json, text/plain, */*" }
        }).then( () => {
            habitacion.status_id = status;
            toastify();
        }).catch(err => {
            console.log('There has been an error trying to update a room -> ', err);
        });
    }

    $scope.fillDataInModal = (room) => {
        pictureContainer.innerHTML = '';
        var videoElement = document.getElementById('video');
        videoElement.pause();
        videoElement.removeAttribute('src'); // empty source
        videoElement.setAttribute('background-color', '#fff'); // empty source
        videoElement.load();



        // let myModal = new bootstrap.Modal(document.getElementById('reportIncidentModal'))
        // myModal.show();
        $scope.incident.room = room;
        $scope.incident.date =  formator.format(new Date());
        //This line is here to clean the description box everytime the user opens it
        $scope.incident.description = '';
    };

    $scope.reportIncident = () => {

        let myModalEl = document.getElementById('reportIncidentModal');
        let modal = bootstrap.Modal.getInstance(myModalEl)
          
        const incidentToSend = {...$scope.incident, users_id: 1};

        $http({
            method: 'POST',
            url: urlService + `observations/store`,
            data: incidentToSend ,
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem("access-token")}`,
                'Accept': 'application/json'
            }
        }).then( () => {
            $scope.photoStillToBeToken = true;
            modal.hide();

            $scope.maskAs(incidentToSend.room, 8);

            toastify();
        }).catch(err => {
            console.log('There has been an error trying to save the observation -> ', err);
        });
    }

    $scope.getHistory = (roomId) => {

        $scope.logs.splice(0);

        $http({
            method: 'GET',
            url: urlService + `showInformation/${roomId}`,
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem("access-token")}`,
                'Accept': 'application/json'
            }
        }).then( response => {
            if(response.data?.code === 12164){
                $scope.appOffline = true;
            }else{
                $scope.appOffline = false;
            }

            $scope.logs = response.data.data;

        }).catch( err => {
            console.log(err);
        });
    }

    const toastify = (message) => {
        Toastify({
            text: message ? message : "Cambios guardados",
            duration: 3500,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #2EE847, #54F230)",
            }
        }).showToast();
    }


    // camera functions

    const camera = new Camera(video);



    $scope.openCamera = () => {
        $scope.showCamera = true;
        camera.power();
    }

    $scope.closeCameraIfOpen = () => {
        $scope.photoStillToBeToken = true;  
        $scope.showCamera = false;
        camera.off();
    }


    $scope.takePicture = () => {
        let picture = camera.takePhoto();


        
        const item =  `<div class=" img-thumbnail ">
                            <img src="${picture}" class="d-block w-100" alt="...">
                        </div>`        

        pictureContainer.innerHTML += item;


        $scope.showCamera = false;
        $scope.photoStillToBeToken = false;
        $scope.incident.picture = picture;
        camera.off();
        toastify('Se ha tomado la foto')
    }

    // end of camera functions


}]);