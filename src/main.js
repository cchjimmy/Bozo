import Engine from "./utilities/Engine.js";
import generatePage from "./menus.js";

(function() {
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`../sw.js`);
  }
  generatePage();

  const engine = new Engine;
  engine.init();
})();