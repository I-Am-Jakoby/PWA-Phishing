self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/index.html',
        '/mrd0x.html',
        '/projects.html',
        '/demo.html',
        '/support.html',
        '/styles.css',
        '/images/icons-192.png',
        '/video/demo.mp4'  // Ensure this path is correct and the resource is accessible
      ]).then(() => console.log('All resources cached successfully!'))
        .catch(error => {
          console.error('Failed to cache resources during install:', error);
        });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;  // Return cached response if available
      }
      return fetch(event.request).then(fetchResponse => {
        // Check if the response is valid and complete
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        var responseToCache = fetchResponse.clone();
        caches.open('v1').then(cache => {
          cache.put(event.request, responseToCache).catch(error => {
            console.error('Failed to cache fetch response:', error);
          });
        });
        return fetchResponse;
      });
    }).catch(error => {
      console.error('Fetch event failed:', error);
      return fetch(event.request);  // Fallback to network in case of error with cache
    })
  );
});
