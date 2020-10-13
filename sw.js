self.addEventListener('install', (event) => {
  // Perform install steps
  console.log('Service Worker: Installed')
});

self.addEventListener('fetch', (event) => {
  // console.log('Service worker: Fetch', event)
})
