import Vec2 from "./utilities/Vec2.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";

export default class Engine {
  constructor() {
    this.sceneManager = new SceneManager;
    this.renderer = new Renderer2D;
    this.assetManager = new AssetManager;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }

    this.renderer.setSize(innerWidth, innerHeight);
    
    this.sceneManager.addEntity({position: new Vec2(10, 50), size: new Vec2(10, 10), velocity: new Vec2(1, 0)});
    
    this.sceneManager.addEntity({position: new Vec2(60, 50), size: new Vec2(10, 20)});
    
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
    // draw only when not resizing
    if (this.isLooping) {
      this.renderer.draw(this.sceneManager.currentEntityPool.entities);
    }
    
    this.update();

    requestAnimationFrame(() => { this.loop(); });
  }

  update() {
    this.sceneManager.update();
  }
}
