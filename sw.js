// credit: https://www.youtube.com/watch?v=dXuvT4oollQ
const cacheName = "cache";
const resourcesToPrecache = [
  '/',
  '/index.html',
  '/res/icons/android-chrome-192x192.png',
  '/res/icons/android-chrome-512x512.png',
  '/res/icons/favicon-16x16.png',
  '/res/icons/favicon-32x32.png',
  '/site.webmanifest',
  '/src/main.js',
  '/src/entry.js',
  '/src/files.js',
  '/src/utilities/Canvas2D.js',
  '/src/utilities/ECS.js',
  '/src/utilities/Engine.js',
  '/src/utilities/debounce.js',
  '/src/utilities/gui/GuiMaker.js',
  '/src/utilities/gui/guiStyle.css',
  '/src/utilities/randomRange.js',
  '/src/utilities/uuidv4.js',
  '/style.css',
]

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(
      cache => cache.addAll(resourcesToPrecache)
    )
  );
});

self.onactivate = (e) => {
  e.waitUntil(clients.claim());
}


// credit: https://medium.com/swlh/how-to-make-your-web-apps-work-offline-be6f27dd28e
self.onfetch = (e) => {
  e.respondWith(
    caches.open(cacheName).then(
      cache => cache.match(e.request).catch(
        fetch(e.request).then(
          response => {
            cache.put(e.request, response.clone());
            return response;
          }
        )
      )
    )
  )
}