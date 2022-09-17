import generatePage from "./src/main.js";

(function() {
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`/sw.js`);
  }
  generatePage();
})();