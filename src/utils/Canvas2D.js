export default class Canvas2D {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d", { alpha: false });
    this._unitScale = 10;
    this._pixelDensity = 1;
    this._clearColor = "black";
    this._zoom = 1;
    this._resolution = {
      width: this.canvas.width,
      height: this.canvas.height
    }
    this._size = {
      width: parseInt(this.canvas.style.width),
      height: parseInt(this.canvas.style.height)
    }
  }

  /**
   * sets resolution of canvas
   * @param {{ width:number, height:number }} resolution
   */
  set setResolution(resolution = { width: this.canvas.width, height: this.canvas.height }) {
    this._resolution = resolution
    this.canvas.width = resolution.width;
    this.canvas.height = resolution.height;
  }

  get resolution() {
    return this._resolution;
  }

  /**
   * @param {number} scale
   */
  set setUnitScale(scale) {
    this._unitScale = scale;
  }

  get unitScale() {
    return this._unitScale;
  }

  /**
   * @param {number} pixelDensity
   */
  set setPixelDensity(pixelDensity) {
    this._pixelDensity = pixelDensity;
    let oldW = this.canvas.width;
    let oldH = this.canvas.height;
    this.setResolution = { width: oldW * this._pixelDensity, height: oldH * this._pixelDensity };
    this.setSize = { width: oldW, height: oldH };
  }

  get pixelDensity() {
    return this._pixelDensity;
  }

  /**
   * sets drawn size of canvas (CSS)
   * @param {{ width: number; height: number; }} size
   */
  set setSize(size) {
    this._size = size;
    this.canvas.style.width = `${size.width}px`;
    this.canvas.style.height = `${size.height}px`;
  }

  /**
   * @param {number} zoom
   */
  set setZoom(zoom) {
    this._zoom = zoom;
    this.context.scale(zoom, zoom);
  }

  get zoom() {
    return this._zoom;
  }

  clear() {
    this.context.save();
    this.context.fillStyle = this._clearColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  changeCanvas(canvas) {
    canvas.width = this.canvas.width;
    canvas.style.width = this.canvas.style.width;
    canvas.height = this.canvas.height;
    canvas.style.height = this.canvas.style.height;
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d", { alpha: false });
  }

  showCanvas(parentSelector) {
    document.querySelector(parentSelector).appendChild(this.canvas);
  }

  get clearColor() {
    return this._clearColor;
  }

  /**
   * @param {string} color
   */
  set setClearColor(color) {
    this._clearColor = color;
  }
}