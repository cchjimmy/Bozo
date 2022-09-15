class Canvas2D {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d", { alpha: false });
    this._unitScale = 10;
    this._pixelDensity = 1;
  }

  /**
   * sets resolution of canvas
   * @param {number} width 
   * @param {number} height 
   */
  setResolution(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * @param {(arg0: number) => void} scale
   */
  set setUnitScale(scale) {
    this._unitScale = scale;
  }

  get unitScale() {
    return this._unitScale;
  }

  /**
   * @param {(arg0: number) => void} pixelDensity
   */
  set setPixelDensity(pixelDensity) {
    this._pixelDensity = pixelDensity;
    let oldW = this.canvas.width;
    let oldH = this.canvas.height;
    this.setResolution(oldW * this._pixelDensity, oldH * this._pixelDensity);
    this.setSize(oldW, oldH);
  }

  get pixelDensity() {
    return this._pixelDensity;
  }

  /**
   * sets drawn size of canvas (CSS)
   * @param {number} width 
   * @param {number} height 
   */
  setSize(width, height) {
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  setZoom(zoom) {
    this.context.scale(zoom, zoom);
  }

  clear(clearColor = "black") {
    this.context.save();
    this.context.fillStyle = clearColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  showCanvas(parentSelector) {
    let parent = document.querySelector(parentSelector);
    if (!parent) {
      return;
    }
    parent.appendChild(this.canvas);
  }
}
window.Canvas2D = Canvas2D;