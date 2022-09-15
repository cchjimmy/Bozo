(function() {
  const engine = new Engine;
  engine.init();

  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`../sw.js`);
  }
})();
