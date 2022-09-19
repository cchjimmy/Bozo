export default class Canvas2D {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d", { alpha: false });
    this._unitScale = 10;
    this._pixelDensity = 1;
    this._clearColor = "#000000";
    this._zoom = 1;
    this._resolution = { x: 0, y: 0 };
    this._size = { x: 0, y: 0 };
    this._isFullscreen = false;
  }

  /**
   * @param {boolean} isFullscreen
   */
  set setFullscreen(isFullscreen) {
    this._isFullscreen = isFullscreen;
  }

  get isFullscreen() {
    return this._isFullscreen;
  }

  /**
   * sets resolution of canvas
   * @param {{ x: number; y: number; }} resolution
   */
  set setResolution(resolution) {
    this._resolution = resolution;
    this.canvas.width = this._resolution.x;
    this.canvas.height = this._resolution.y;
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
    let oldW = this._size.x;
    let oldH = this._size.y;
    this.setResolution = { x: oldW * this._pixelDensity, y: oldH * this._pixelDensity };
    this.setSize = { x: oldW, y: oldH };
  }

  get pixelDensity() {
    return this._pixelDensity;
  }

  /**
   * sets drawn size of canvas (CSS)
   * @param {{ x: number; y: number; }} size
   */
  set setSize(size) {
    this._size = size;
    this.canvas.style.width = `${this._size.x}px`;
    this.canvas.style.height = `${this._size.y}px`;
  }

  get size() {
    return this._size;
  }

  /**
   * @param {number} zoom
   */
  set setZoom(zoom) {
    this._zoom = zoom;
    this.context.scale(this._zoom, this._zoom);
  }

  get zoom() {
    return this._zoom;
  }

  /**
   * @param {string} color
   */
  set setClearColor(color) {
    this._clearColor = color;
  }

  get clearColor() {
    return this._clearColor;
  }

  clear() {
    this.context.save();
    this.context.fillStyle = this._clearColor;
    this.context.fillRect(0, 0, this._resolution.x, this._resolution.y);
    this.context.restore();
  }

  changeCanvas(canvas) {
    canvas.width = this._resolution.x;
    canvas.height = this._resolution.y;
    canvas.style.width = `${this._size.x}px`;
    canvas.style.height = `${this._size.y}px`;
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d", { alpha: false });
  }

  showCanvas(parentSelector) {
    document.querySelector(parentSelector).appendChild(this.canvas);
  }

  handleFullscreen() {
    if (!this._isFullscreen) return;
    this.setSize = { x: innerWidth, y: innerHeight };
    this.setPixelDensity = this._pixelDensity;
  }
}