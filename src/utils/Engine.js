import ECS from "./ECS.js";
import debounce from "./debounce.js";
import Canvas2D from "./Canvas2D.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 848, height: 480 },
    pixelDensity: 1,
    unitScale: 10,
    frameRate: 30,
    zoom: 3,
  }) {
    this.options = {
      resolution: { width: 848, height: 480 },
      pixelDensity: 1,
      unitScale: 10,
      frameRate: 30,
      zoom: 3,
    };
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }
    this.ecs = new ECS;
    this.renderer = new Canvas2D;
    this._isLooping = false;
  }

  init() {
    if (!this.renderer.context) return;

    this.renderer.setResolution = this.options.resolution;
    this.renderer.setUnitScale = this.options.unitScale;
    this.renderer.setPixelDensity = this.options.pixelDensity;
    this.renderer.setZoom = this.options.zoom;

    window.onresize = () => {
      this._isLooping = false;
      debounce({
        func: () => {
          this._isLooping = true;
        }
      });
    }

    this._isLooping = true;
    this.animate();
  }

  animate() {
    // draw only when not resizing
    if (this._isLooping) {
      this.renderer.clear();
      this.loop();
    }
    requestAnimationFrame(() => { this.animate(); });
  }

  loop() {

  }
}