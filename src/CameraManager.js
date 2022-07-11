// import Renderer2D from "./Renderer2D.js";
import uuidv4 from "./utilities/uuidv4.js";

export default class CameraManager {
  constructor() {
    this.cameras = {};
    this.currentCamera = null;
    this.components = {};
  }

  addCamera(components) {
    let id = new uuidv4();
    let camera = { id };
    this.cameras[id] = camera;

    for (let component in components) {
      if (!this.components[component]) {
        this.components[component] = {};
      }
      this.components[component][id] = components[component];
    }

    return camera
  }

  getCameras() {
    return this.cameras;
  }
}