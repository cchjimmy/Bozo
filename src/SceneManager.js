import uuidv4 from "./utilities/uuidv4.js";
import EntityManager from "./EntityManager.js";
import ControlManager from "./ControlManager.js";

export default class SceneManager extends EntityManager {
  constructor() {
    super();
    this.scenes = {};
    this.currentScene = this.createScene();
    this.currentEntityPool = this.createEntityPool(this.getCurrentSceneId())
    this.webWorker = new Worker("./src/SMWebWorker.js");
    this.controlManager = new ControlManager;
    this.transforms = [];
    this.colors = [];
  }

  createScene() {
    let id = uuidv4();
    let scene = { id };
    this.scenes[id] = scene;
    return scene;
  }

  update(timeStep, unitScale, canvasWidth, canvasHeight) {
    this.webWorker.postMessage([timeStep, this.components, this.getEntityIds(), unitScale, canvasWidth, canvasHeight]);
    this.webWorker.onmessage = (e) => {
      this.components = e.data[0];
      this.transforms = e.data[1];
      this.colors = e.data[2];
    }
  }

  setCurrentScene(id) {
    if (!this.scenes[id]) {
      console.error("Please input a valid scene id");
      return;
    }
    this.currentScene = this.scenes[id];
  }

  getCurrentSceneId() {
    return this.currentScene.id;
  }

  getScenes() {
    return this.scenes;
  }

  setCurrentEntityPool(id) {
    this.currentEntityPool = this.getEntityPools()[id];
  }

  getTransforms() {
    return this.transforms;
  }
  
  getColors() {
    return this.colors;
  }
}
