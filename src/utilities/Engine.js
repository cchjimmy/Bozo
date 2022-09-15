(function() {
  function Engine(options = {
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

  Engine.prototype.init = () => {
    if (!this.renderer.context) {
      return;
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

  Engine.prototype.loop = () => {
    // draw only when not resizing
    if (this.isLooping) {
      this.renderer.clear("blue");
    }
    requestAnimationFrame(() => { this.loop(); });
  }
  window.Engine = Engine;
})();