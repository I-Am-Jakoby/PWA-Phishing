self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/index.html',  // Assuming you want this cached; adjust if it's dynamically generated
        '/mrd0x.html',
        '/projects.html',
        '/demo.html',
        '/support.html',
        '/styles.css',
        '/images/icons-192.png',
        '/video/demo.mp4',  // Include this if your video is a critical resource
      ]).catch(error => {
        console.error('Failed to cache resources during install:', error);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open('v1').then(cache => {
          cache.put(event.request, fetchResponse.clone()).catch(error => {
            console.error('Failed to cache fetch response:', error);
          });
          return fetchResponse;
        });
      });
    }).catch(error => {
      console.error('Fetch event failed:', error);
      return fetch(event.request); // Fallback to network in case of error with cache
    })
  );
});
