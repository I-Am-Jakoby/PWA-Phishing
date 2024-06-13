self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open('v1')
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll([
          '/index.html',
          '/mrd0x.html',
          '/server.html',
          '/installation.html',
          '/demo.html',
          '/support.html',
          '/styles.css',
          '/images/icons-192.png',
          '/video/demo.mp4'  // Ensure this path is correct and the resource is accessible
        ]);
      })
      .then(() => {
        console.log('All resources cached successfully!');
      })
      .catch(error => {
        console.error('Failed to cache resources during install:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }

        // Not in cache - return the result from the live server
        return fetch(event.request).then(fetchResponse => {
          // Check if we received a valid response
          if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          var responseToCache = fetchResponse.clone();

          caches.open('v1')
            .then(cache => {
              cache.put(event.request, responseToCache).catch(error => {
                console.error('Failed to cache fetch response:', error);
              });
            });

          return fetchResponse;
        });
      })
      .catch(error => {
        console.error('Fetch handling failed:', error);
        throw error;
      })
  );
});
