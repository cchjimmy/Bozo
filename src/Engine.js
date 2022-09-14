import debounce from "./utilities/debounce.js";
import Canvas2D from "./utilities/Canvas2D.js";
import GuiMaker from "./utilities/gui/GuiMaker.js";
import ECS from "./utilities/ECS.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 848, height: 480 },
    pixelDensity: 1,
    unitScale: 10,
    frameRate: 30,
    zoom: 3,
    showFps: true,
    showQuadtree: true,
    uiTheme: "dark"
  }) {
    this.options = {
      resolution: { width: 848, height: 480 },
      pixelDensity: 1,
      unitScale: 10,
      frameRate: 30,
      zoom: 3,
      showFps: true,
      showQuadtree: true,
      uiTheme: "dark"
    };
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }
    this.ecs = new ECS;
    this.renderer = new Canvas2D;
  }

  init() {
    if (!this.renderer.context) {
      return console.error("Unable to initialize renderer.");
    }
    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
    this.renderer.setUnitScale = this.options.unitScale;
    this.renderer.setPixelDensity = this.options.pixelDensity;
    this.renderer.setZoom(this.options.zoom);

    this.renderer.canvas.classList.add("centered");

    window.onresize = () => {
      this.isLooping = false;
      debounce({
        func: () => {
          this.isLooping = true;
        }
      });
    }
    this.isLooping = true;
    this.loop();
  }

  loop() {
    // draw only when not resizing
    if (this.isLooping) {
      this.renderer.clear("blue");
      // this.renderer.draw(this.sceneManager.getTransforms(), this.sceneManager.getColors());
    }

    // if (this.options.showQuadtree) {
    //   this.renderer.qtree.show(this.renderer.context);
    // }
    requestAnimationFrame(() => { this.loop(); });
  }
}