// credit: https://www.youtube.com/watch?v=dXuvT4oollQ
const cacheName = "cache";
const resourcesToPrecache = [
  './',
  './entry.js',
  // './res/icons/android-chrome-192x192.png',
  './res/icons/favicon-16x16.png',
  './res/icons/favicon-32x32.png',
  './site.webmanifest',
  './src/files.js',
  './src/main.js',
  './src/utils/Canvas2D.js',
  './src/utils/ECS.js',
  './src/utils/Engine.js',
  './src/utils/debounce.js',
  './src/utils/gui/GuiMaker.js',
  './src/utils/gui/guiStyle.css',
  './style.css',
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