import uuidv4 from "./utilities/uuidv4.js";
import EntityManager from "./EntityManager.js";
import ControlManager from "./ControlManager.js";

export default class SceneManager extends EntityManager {
  constructor() {
    super();
    this.scenes = {};
    this.currentScene = this.createScene();
    this.currentEntityPool = this.createEntityPool(this.getCurrentSceneId());
    this.controlManager = new ControlManager;
    this.webWorker = new Worker("./src/SMWebWorker.js");
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
    this.webWorker.postMessage({ timeStep, components: this.components, entityIds: this.getEntityIds(), unitScale, canvasWidth, canvasHeight, name: "newProperties" });
    this.webWorker.onmessage = (e) => {
      this.components = e.data.components;
      this.transforms = e.data.transforms;
      this.colors = e.data.colors;
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
