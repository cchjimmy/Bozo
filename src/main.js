import Engine from "./Engine.js";

const engine = new Engine();

(function init() {
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`../sw.js`).then(() => { console.log("Service Worker Registered") });
  }
  
  engine.init();
  return;
})();