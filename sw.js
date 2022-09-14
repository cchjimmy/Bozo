// credit: https://www.youtube.com/watch?v=dXuvT4oollQ

const cachName = "cach-v1";
const resourcesToPrecache = [
  '/',
  'index.html',
  'style.css',
  'src/main.js',
  'src/Engine.js',
  'src/utilities/gui/GuiMaker.js',
  'src/utilities/gui/guiStyle.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
  'src/utilities/Canvas2D.js',
  'src/utilities/debounce.js',
  'src/utilities/ECS.js',
  'res/texture.png',
  'site.webmanifest'
]

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cachName).then(cache => {
      return cache.addAll(resourcesToPrecache);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request.url).then(response => {
    return response || fetch(e.request.url);
  }));
});