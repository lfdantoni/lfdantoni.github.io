const IMMUTABLE_CACHE = 'immutable_cache_v3';
const STATIC_CACHE = 'static_cache_v7';
const DYNAMIC_CACHE = 'dynamic_cache_v3';

const IMMUTABLE_CACHE_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
]

const STATIC_CACHE_FILES = [
  '/index.html',
  '/index.js',
  '/styles.css',
  '/sw.js',
  '/manifest.json',
  './',
  '/products-component.js',
  '/images/favicon.ico',
  '/images/icon96.png',
  '/images/icon144.png',
  '/images/icon180.png',
  '/images/icon192.png',
  '/images/icon512.png',
  '/images/sample-1.jpg'
]

// INSTALL
self.addEventListener('install', (event) => {
  // Perform install steps
  console.log('Service Worker: Installed2');

  // event.waitUntil(
  //   new Promise(resolve => {
  //     // do something
  //     console.log('Doing something on install event')

  //     resolve()
  //   })
  // );

  // With skipWaiting
  // event.waitUntil(
  //   new Promise(resolve => {
  //     // do something
  //     console.log('Doing something on install event')

      
  //     resolve()
  //   }).then(self.skipWaiting())
  // );

  // With cache
  // Creates immutable cache
  const immCachePromise = caches.open(IMMUTABLE_CACHE)
    .then(cache => {
      return cache.addAll(IMMUTABLE_CACHE_FILES);
    });

  // Creates static cache
  const staticCachePromise = caches.open(STATIC_CACHE)
    .then(cache => {
      return cache.addAll(STATIC_CACHE_FILES);
    });

  // waits till both promises finish
  event.waitUntil(
    Promise.all([
      immCachePromise,
      staticCachePromise
    ])
    .then(self.skipWaiting()) // puts the present SW version ready to activate
  );
});

// ACTIVATE

self.addEventListener('activate', (event) => {
  console.log('Service worker: Active', event)

  // event.waitUntil(
  //   new Promise(resolve => {
  //     // do something
  //     console.log('Doing something on activate event')
      
  //     resolve()
  //   })
  // );

  // Clean previous cached files
  const currentCaches = [IMMUTABLE_CACHE, STATIC_CACHE, DYNAMIC_CACHE];

  event.waitUntil(
    // Gets all cache space names (keys)
    caches.keys().then(cacheNames => {
      // filters for any different cache version
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName))

    }).then(cachesToDelete => {
      // waits for all delete promises
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        // cache.delete returns a promise
        return caches.delete(cacheToDelete);

      }))

    }).then(self.clients.claim()) // takes control of all clients
  )
})

// FETCH
const checkNonDynamicRequest = async (request) => {
  return Promise.all([
    caches.open(STATIC_CACHE).then(cache => cache.match(request)),
    caches.open(IMMUTABLE_CACHE).then(cache => cache.match(request))
  ])
  .then(responses => responses.filter(r => !!r).length > 0)
}

self.addEventListener('fetch', (event) => {
  console.log('Service worker: Fetch', event);

  // RESPONSE DEFAULT
  // event.respondWith(
  //   new Promise((resolve, reject) => {
  //     // do something
  //     console.log('Doing something on activate event')
      
  //     if(event.request.method === 'GET' && event.request.url.includes(location.origin)) {
  //       const defaultResponse = new Response('<h1>Not Found</h1>', {
  //         status: 200,
  //         statusText: "I am a custom service worker response!",
  //         headers: {'Content-Type': 'text/html'}
  //       });

  //       fetch(event.request)
  //         .then(resolve)
  //         .catch(() => resolve(defaultResponse))
  //     }

     
  //     fetch(event.request)
  //       .then(resolve)
  //       .catch(reject)
      
  //   })
  // );
  
  // CACHE Only
  // event.respondWith(caches.match(event.request));

  // Cache falling back to Network
  // event.respondWith(
  //   caches.match(event.request).then(response => {
  //     return response || fetch(event.request)
  //   })
  // )

  // Network falling back to Cache
  // event.respondWith(
  //   fetch(event.request).catch(() => {
  //     return caches.match(event.request)
  //   })
  // )

  // Cache then network (Stale while revalidate)
  // event.respondWith(
  //   caches.match(event.request).then(response => {
  //     fetch(event.request).then(resFetch => {
  //       caches.open(DYNAMIC_CACHE).then(cache => {
  //         cache.put(event.request.clone(), resFetch.clone());
  //       })
  //     })

  //     return response;
  //   })
  // )

  // Cache falling back to Network (with save)
  event.respondWith(
    caches.match(event.request).then(response => {
      if(response) {
        return response;
      } else {
        return fetch(event.request).then(async fetchResponse => {
          // non-GET requests are not allowed to save
          if(event.request.method === 'GET' && !await checkNonDynamicRequest(event.request)) {
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(event.request.clone(), fetchResponse)
            })
          }

          // it could be blocked when fetchResponse is used on cache.put
          return fetchResponse.clone();
        })
      }
    })
  )

  // Network falling back to Cache (with save) - it does not pass lighthouse
  // event.respondWith(
  //   fetch(event.request)
  //     .then(async response => {
  //       // non-GET requests are not allowed to 
  //       // checkNonDynamicRequest checks if the request is already saved in other caches
  //       if(event.request.method === 'GET' && !await checkNonDynamicRequest(event.request)) {
  //         caches.open(DYNAMIC_CACHE).then(cache => {        
  //           cache.put(event.request.clone(), response)
  //         })
  //       }

  //       return response.clone();
  //     })
  //     .catch(() => {
  //       return caches.match(event.request)
  //     })
  // )
})

self.addEventListener('push', (event) => {
  const data = event.data.json(); 
  self.registration.showNotification(data.title, data.options)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log(event.action);
  console.log(event.notification.data);

  const action = event.action;
  const links = event.notification.data;

  // let examplePage = '';

  // switch(event.action) {
  //   case 'coffee-action':
  //     examplePage = '/';
  //     break;
  //   case 'doughnut-action':
  //     examplePage = '/#/about';
  //     break;
  //   default:
  //     return;
  // }

  const promiseChain = clients.openWindow(links[action] || '/');
  event.waitUntil(promiseChain);
})
