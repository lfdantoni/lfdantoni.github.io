self.addEventListener('install', (event) => {
  // Perform install steps
  console.log('Service Worker: Installed');

  event.waitUntil(
    new Promise(resolve => {
      // do something

      resolve()
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker: Active', event)

  event.waitUntil(
    new Promise(resolve => {
      // do something

      resolve()
    })
  );
})


self.addEventListener('fetch', (event) => {
  console.log('Service worker: Fetch', event);

  event.respondWith(
    new Promise((resolve, reject) => {
      if(event.request.url.includes(location.origin)) {
        const defaultResponse = new Response('<h1>Not Found</h1>', {
          status: 200,
          statusText: "I am a custom service worker response!",
          headers: {'Content-Type': 'text/html'}
        });

        return fetch(event.request)
          .then(resolve)
          .catch(resolve(defaultResponse));
      }

      return fetch(event.request)
        .then(resolve)
        .catch(reject);
    })
  )

})
