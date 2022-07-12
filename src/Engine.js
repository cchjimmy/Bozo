import Vec2 from "./utilities/Vec2.js";
import debounce from "./utilities/debounce.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";
import randomRange from "./utilities/randomRange.js";
import CameraManager from "./CameraManager.js";
import GuiManager from "./gui/GuiManager.js";
import AudioManager from "./AudioManager.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 256, height: 240 },
    pixelDensity: 1,
    unitScale: 10,
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
    this.audioManager = new AudioManager;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }

    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
    this.renderer.setUnitScale(this.options.unitScale);
    this.renderer.setPixelDensity(this.options.pixelDensity);

    for (let i = 0; i < 1000; i++) {
      this.sceneManager.createEntity({
        position: new Vec2(randomRange(-5, 5), randomRange(-5, 5)),
        size: new Vec2(randomRange(1, 2), randomRange(1, 2)),
        velocity: new Vec2(randomRange(-1, 1), randomRange(-1, 1)),
        color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`,
        collider: true
      });
    }

    this.sceneManager.createEntity({ position: new Vec2(0, 0), collider: true });
    // this.sceneManager.createEntity({ position: new Vec2(1, 1), camera: new Vec2(0, 0), collider: true });

    function resizeToFit(renderer, options) {
      if (window.innerWidth > window.innerHeight) {
        renderer.setSize(options.resolution.width * innerHeight / options.resolution.height, innerHeight);
      } else {
        renderer.setSize(innerWidth, options.resolution.height * innerWidth / options.resolution.width);
      }
    }
    resizeToFit(this.renderer, this.options);

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        resizeToFit(this.renderer, this.options);
        this.isLooping = true;
      }, 200);
    }

    this.isLooping = true;
    this.loop();

    this.sceneManager.update(1 / this.options.frameRate, this.renderer.unitScale, this.renderer.canvas.width, this.renderer.canvas.height);
  }

  loop() {
    if (this.isLooping) {
      this.renderer.clear();
      // draw only when not resizing
      this.renderer.draw(this.sceneManager.getTransforms(), this.sceneManager.getColors());
    }

    requestAnimationFrame(() => { this.loop(); });

    if (this.options.showQuadtree) {
      this.renderer.qtree.show(this.renderer.context);
    }
  }
}
