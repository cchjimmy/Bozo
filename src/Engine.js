import Vec2 from "./utilities/Vec2.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";
import randomRange from "./utilities/randomRange.js";

export default class Engine {
  constructor(options = { resolution: { width: 800, height: 600 }, showFps: true, showQuadtree: false }) {
    this.options = {};
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }

    this.sceneManager = new SceneManager;
    this.renderer = new Renderer2D;
    this.assetManager = new AssetManager;

    this.prevTime = performance.now();
    this.frames = 0;
    this.timeStep = 1 / 60;

    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }

    this.renderer.setSize(innerWidth, innerHeight);

    for (let i = 0; i < 500; i++) {
      this.sceneManager.addEntity({
        position: new Vec2(randomRange(0, innerWidth), randomRange(0, innerHeight)),
        size: new Vec2(randomRange(10, 40), randomRange(10, 40)),
        velocity: new Vec2(randomRange(-50, 50), randomRange(-50, 50)),
        color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`
      });
    }

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
    const start = performance.now();

    this.renderer.clear();

    let entityIds = this.sceneManager.getEntityIds();
    let deltaTime = new Vec2(this.timeStep, this.timeStep);
    for (let i = 0; i < entityIds.length; i++) {
      this.update(deltaTime, entityIds[i], this.sceneManager.components);
    }

    requestAnimationFrame(() => { this.loop(); });

    if (this.options.showFps) {
      this.renderer.context.strokeStyle = "white";
      this.renderer.context.strokeText(`fps: ${(1 / this.timeStep).toFixed(0)}`, 10, 10);
    }

    if (this.options.showQuadtree) {
      this.renderer.qtree.show(this.renderer.context);
    }

    this.frames++;

    if (start >= this.prevTime + 1000) {
      this.timeStep = (start - this.prevTime) / (this.frames * 1000);
      this.prevTime = start;
      this.frames = 0;
    }
  }

  update(timeStep, id, components) {
    // draw only when not resizing
    if (this.isLooping) {
      this.renderer.draw(components, id);
    }
    this.sceneManager.update(timeStep, id);
  }
}
