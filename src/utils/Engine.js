import ECS from "./ECS.js";
import debounce from "./debounce.js";
import Canvas2D from "./Canvas2D.js";

export default class Engine {
  constructor(options = {
    resolution: { x: 848, y: 480 },
    pixelDensity: 1,
    unitScale: 10,
    frameRate: 30,
    zoom: 3,
  }) {
    this.options = {
      resolution: { x: 848, y: 480 },
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
    this.lastTime = performance.now();
  }

  init() {
    if (!this.renderer.context) return;

    this.renderer.setSize = { x: this.options.resolution.x, y: this.options.resolution.y };
    this.renderer.setUnitScale = this.options.unitScale;
    this.renderer.setPixelDensity = this.options.pixelDensity;
    this.renderer.setZoom = this.options.zoom;

    window.onresize = () => {
      this._isLooping = false;
      debounce({
        func: () => {
          this.renderer.handleFullscreen();
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
      let now = performance.now();
      this.ecs.update(now - this.lastTime);
      this.lastTime = now;
    }
    requestAnimationFrame(() => { this.animate(); });
  }
}