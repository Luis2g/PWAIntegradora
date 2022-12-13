importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js')
importScripts('./js/util/sw-db.js');

const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';



self.addEventListener('install', event => {
    console.log('instalado');

    const promiseCache = caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll(
            [
                './',
                './index.html',
                './login.html',
                './login',
                './js/util/camera.js',
                './views/general/principal.html',
                './views/layouts/navbar.html',
                './views/users/admin/roomAdministration.html',
                './css/bootstrap.css',
                './css/styles.css',
                './js/controllers/managerController.js',
                './js/controllers/navbarController.js',
                './js/controllers/principalController.js',
                './js/controllers/sessionController.js',
                './js/imports/angular-route.min.js',
                './js/imports/angular.min.js',
                './js/imports/bootstrap.js',
                './js/imports/feather.min.js',
                './js/imports/jquery-3.6.0.min.js',
                './js/app.js',
                './js/util/sw-db.js',
                './sw.js',
                './manifest.json',
                './images/icons/72x72.png',
                './images/icons/96x96.png',
                './images/icons/128x128.png',
                './images/icons/144x144.png',
                './images/icons/152x152.png',
                './images/icons/192x192.png',
                './images/icons/384x384.png',
                './images/icons/512x512.png',
            ]
        );
    });

    const promiseCacheInmutable = caches
        .open(INMUTABLE_CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css',
                'https://unpkg.com/sweetalert/dist/sweetalert.min.js',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
                'https://cdn.jsdelivr.net/npm/toastify-js',
                'https://unpkg.com/feather-icons',
                'https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js'
            ]);
        });

    event.waitUntil(Promise.all([promiseCache, promiseCacheInmutable]));

});

self.addEventListener('activate', (event) => {
    const promDeleteCaches = caches.keys().then((items) => {
        items.forEach((key) => {
            if (key !== STATIC_CACHE_NAME && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
    event.waitUntil(promDeleteCaches);
});



self.addEventListener('fetch', (event) => {

    // This is for the post and put
    if (event.request.clone().method === 'POST') {

        const respuesta = fetch(event.request.clone())
            .then(respWeb => {
                return respWeb
            })
            .catch(() => {

                if (self.registration.sync) {
                    return event.request.json().then(body => {
                        console.log(body);
                        const respOffline = saveObservation(body);
                        return respOffline;
                    });
                }
            });

        event.respondWith(respuesta);

    } else if (event.request.clone().method === 'PUT') {

        const respuesta = fetch(event.request.clone())
            .then(respWeb => {
                return respWeb
            })
            .catch(() => {

                if (self.registration.sync) {
                    return event.request.json().then(body => {
                        console.log(body);
                        const respOffline = updateRoom(body);
                        return respOffline;
                    });
                }
            });

        event.respondWith(respuesta);

    } else {

        let resp;
        //This is for all the gets 
        if (!event.request.url.includes('api')) {
            resp = caches.match(event.request);
        } else {
            resp = fetch(event.request).then((respWeb) => {
                if (!respWeb) {
                    return caches.match(event.request);
                }
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    cache.put(event.request, respWeb)
                    // cleanCache(DYNAMIC_CACHE_NAME, 41);
                });
                return respWeb.clone();
            }).catch(() => {
                let responseOffline;

                responseOffline = caches.match(event.request).then(response => {

                    if (!response) {

                        let data = [];

                        const respBodyOffLine = {
                            data,
                            code: 12164,
                            message: 'No se ha podido establecer conexión a internet'
                        }

                        response = new Response(
                            JSON.stringify(respBodyOffLine),
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        )
                    }
                    return response;
                })
                return responseOffline;
            });
        }
        event.respondWith(resp);
    }
});


self.addEventListener('sync', event => {
    console.log('SW: sync');
    let respPromSync;
    if (event.tag === 'nuevo-post') {
        respPromSync = sendPostObservation();
    }
    if (event.tag === 'update-room') {
        respPromSync = updatedRoomFromPouch();
    }
    event.waitUntil(respPromSync);
});

self.addEventListener('activate', (event) => {
    const promDeleteCaches = caches.keys().then((items) => {
      items.forEach((key) => {
        if (key !== STATIC_CACHE_NAME && key.includes('static')) {
          return caches.delete(key);
        }
      });
    });
    event.waitUntil(promDeleteCaches);
  });
  







