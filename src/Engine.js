import Vec2 from "./utilities/Vec2.js";
import debounce from "./utilities/debounce.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";
import randomRange from "./utilities/randomRange.js";
import CameraManager from "./CameraManager.js";
import GuiManager from "./gui/GuiManager.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 800, height: 600 },
    frameRate: 30,
    showFps: true,
    showQuadtree: false
  }) {
    this.options = {};
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }

    this.sceneManager = new SceneManager;
    this.renderer = new Renderer2D;
    this.assetManager = new AssetManager;
    this.cameraManager = new CameraManager;
    this.guiManager = new GuiManager;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }

    this.renderer.setPixelDensity(1 / 2);
    this.renderer.setResolution(innerWidth, innerHeight);
    this.renderer.setSize(innerWidth, innerHeight);

    for (let i = 0; i < 1000; i++) {
      this.sceneManager.createEntity({
        position: new Vec2(randomRange(-10, 10), randomRange(-10, 10)),
        size: new Vec2(randomRange(1, 2), randomRange(1, 2)),
        velocity: new Vec2(randomRange(-1, 1), randomRange(-1, 1)),
        color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`,
        // collider: true
      });
    }

    // this.sceneManager.createEntity({ position: new Vec2(0, 0), collider: true });
    // this.sceneManager.createEntity({ position: new Vec2(1, 1), camera: new Vec2(0, 0), collider: true });

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        this.renderer.setResolution(innerWidth, innerHeight);
        this.renderer.setSize(innerWidth, innerHeight);
        this.isLooping = true;
      }, 200);
    }

    this.isLooping = true;
    this.loop();

    this.sceneManager.update(1 / this.options.frameRate);
  }

  loop() {
    if (this.isLooping) {
      this.renderer.clear();
      let entityIds = this.sceneManager.getEntityIds();
      for (let i = 0; i < entityIds.length; i++) {
        // draw only when not resizing
        this.renderer.draw(entityIds[i], this.sceneManager.components);
      }
    }

    requestAnimationFrame(() => { this.loop(); });

    // if (this.options.showFps) {
    //   this.renderer.context.strokeStyle = "white";
    //   this.renderer.context.strokeText(`fps: ${(1 / this.timeStep).toFixed(0)}`, 10, 10);
    // }

    if (this.options.showQuadtree) {
      this.renderer.qtree.show(this.renderer.context);
    }
  }
}
