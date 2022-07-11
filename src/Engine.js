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

    function resize(renderer, scale) {
      renderer.setResolution(Math.floor(innerWidth * scale), Math.floor(innerHeight * scale));
      renderer.setSize(Math.floor(innerWidth), Math.floor(innerHeight));
      // renderer.context.scale(scale, scale);
    }
    resize(this.renderer, 1/5);

    for (let i = 0; i < 500; i++) {
      this.sceneManager.createEntity({
        position: new Vec2(randomRange(-this.renderer.canvas.width / 2, this.renderer.canvas.width / 2), randomRange(-this.renderer.canvas.height / 2, this.renderer.canvas.height / 2)),
        size: new Vec2(randomRange(1, 10), randomRange(1, 10)),
        velocity: new Vec2(randomRange(-50, 50), randomRange(-50, 50)),
        color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`,
        //collider: true
      });
    }

    // this.sceneManager.createEntity({ position: new Vec2(0, 0) });
    // this.sceneManager.createEntity({ position: new Vec2(1, 1), camera: new Vec2(0, 0) });

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        resize(this.renderer, 1 / 5);
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
