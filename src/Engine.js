import Vec2 from "./utilities/Vec2.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";
import EntityManager from "./EntityManager.js";

export default class Engine {
  constructor() {
    this.sceneManager = new SceneManager;
    this.renderer = new Renderer2D;
    this.assetManager = new AssetManager;
    this.entityManager = new EntityManager;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }

    this.renderer.setSize(innerWidth, innerHeight);
    
    // credit: https://stackoverflow.com/questions/63301553/debounce-function-not-working-in-javascript
    let timer;
    function debounce(func, timeout = 300) {
      return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      })();
    }

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        this.renderer.setSize(innerWidth, innerHeight);
        this.isLooping = true;
      }, 200);
    }

    this.isLooping = true;
    this.loop();
  }

  loop() {
    this.update();

    // draw only when not resizing
    if (this.isLooping) {
      this.renderer.draw();
    }

    // requestAnimationFrame(() => { this.loop(); });
  }

  update() {

  }
}
