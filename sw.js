// credit: https://www.youtube.com/watch?v=dXuvT4oollQ
const cacheName = "cach-v1";
const resourcesToPrecache = [
  '/',
  '/index.html',
  '/res/icons/android-chrome-192x192.png',
  '/res/icons/android-chrome-512x512.png',
  '/res/icons/favicon-16x16.png',
  '/res/icons/favicon-32x32.png',
  '/site.webmanifest',
  '/src/main.js',
  '/src/menus.js',
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
    caches.open(cacheName).then(cache => {
      return cache.addAll(resourcesToPrecache);
    })
  );
});

self.onactivate = (e) => {
  e.waitUntil(clients.claim());
}


// credit: https://medium.com/swlh/how-to-make-your-web-apps-work-offline-be6f27dd28e
self.onfetch = (e) => {
  e.respondWith(
    caches.match(e.request).then(
      response => response
    ).catch(fetch(e.request).then(
      response => {
        caches.open(cacheName).then(
          cache => cache.put(e.request, response)
        )
      }).catch((err) => { console.log(err); }))
  )
}