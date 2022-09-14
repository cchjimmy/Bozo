import Engine from "./Engine.js";
import menus from "./menus.js";

(function init() {
  const engine = new Engine();
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`../sw.js`).then(() => { console.log("Service Worker Registered") });
  }
  engine.init();
  return;
})();