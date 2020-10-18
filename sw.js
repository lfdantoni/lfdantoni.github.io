self.addEventListener('install', (event) => {
  // Perform install steps
  console.log('Service Worker: Installed');

  event.waitUntil(
    new Promise(resolve => {
      // do something
      console.log('Doing something on install event')

      resolve()
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker: Active', event)

  event.waitUntil(
    new Promise(resolve => {
      // do something
      console.log('Doing something on activate event')
      
      resolve()
    })
  );
})


self.addEventListener('fetch', (event) => {
  console.log('Service worker: Fetch', event);

  event.respondWith(
    new Promise((resolve, reject) => {
      // do something
      console.log('Doing something on activate event')
      
      if(event.request.method === 'GET' && event.request.url.includes(location.origin)) {
        const defaultResponse = new Response('<h1>Not Found</h1>', {
          status: 200,
          statusText: "I am a custom service worker response!",
          headers: {'Content-Type': 'text/html'}
        });

        fetch(event.request)
          .then(resolve)
          .catch(() => resolve(defaultResponse))
      }

     
      fetch(event.request)
        .then(resolve)
        .catch(reject)
      
    })
  );
})
