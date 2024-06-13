self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/mrd0x.html',
        '/styles.css',
        '/images/icons-192.png',
      ]).catch(error => {
        console.error('Failed to cache resources during install:', error);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  // Only process GET requests.
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.url.endsWith('index.html')) {
    // Don't cache index.html to ensure the user gets the latest version
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(fetchResponse => {
          // Only cache valid responses
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
      })
    );
  }
});
