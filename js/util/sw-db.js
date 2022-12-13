const dbUno = new PouchDB("observations");
const dbDos = new PouchDB("rooms");

const serverApiSwForObservation = 'http://localhost:8000/api/observations/store';
const serverApiSwForRoomUpdate = 'http://localhost:8000/api/rooms/update/';


function saveObservation(observation){

    observation.offMode = true;

    observation._id=new Date().toISOString();
    return dbUno.put(observation).then(()=>{
        console.log('observation saved');
        self.registration.sync.register('nuevo-post');
        const respBodyOffLine = {
            result: true,
            observation
        }

        const respOffline = new Response(
            JSON.stringify(respBodyOffLine),
            {
                headers:{
                    'Content-Type': 'application/json'
                }
            }
        )
        return respOffline;
    })
}

function updateRoom(updatedRoom){

    updatedRoom.offMode = true;

    updatedRoom._id=new Date().toISOString();
    return dbDos.put(updatedRoom).then(()=>{
        console.log('updatedRoom udpated');
        self.registration.sync.register('update-room');
        const respBodyOffLine = {
            result: true,
            updatedRoom
        }

        const respOffline = new Response(
            JSON.stringify(respBodyOffLine),
            {
                headers:{
                    'Content-Type': 'application/json'
                }
            }
        )
        return respOffline;
    })
}

function sendPostObservation(){

    const allPromise = [];

    dbUno.allDocs( { include_docs: true } )
    .then( docs => {    
        docs.rows.forEach(row => {
            const doc = row.doc;
            const prom = fetch(serverApiSwForObservation, {
                method: 'POST',
                body: JSON.stringify(doc),
                headers: {
                  'Content-Type': 'application/json',
                },
              }).then( resp => {
                return dbUno.remove(doc);
              });
            allPromise.push(prom);
        });
    });

    return allPromise;

}


function updatedRoomFromPouch(){

    const allPromise = [];

    dbDos.allDocs( { include_docs: true } )
    .then( docs => {    
        docs.rows.forEach(row => {

            console.log("Below the doc");
            console.log(row.doc);

            const doc = row.doc;
            const prom = fetch(serverApiSwForRoomUpdate + row.doc.room.id, {
                method: 'PUT',
                body: JSON.stringify(doc),
                headers: {
                  'Content-Type': 'application/json',
                },
              }).then( resp => {
                return dbDos.remove(doc);
              }).catch( err => {
                console.log('This is the error ', err);
              } );
            allPromise.push(prom);
        });
    });

    return allPromise;

}

