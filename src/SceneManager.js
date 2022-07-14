import uuidv4 from "./utilities/uuidv4.js";
import EntityManager from "./EntityManager.js";
import debounce from "./utilities/debounce.js";
// import ControlManager from "./ControlManager.js";

export default class SceneManager extends EntityManager {
  constructor() {
    super();
    this.scenes = {};
    this.currentScene = this.createScene();
    this.currentEntityPool = this.createEntityPool(this.getCurrentSceneId());
    // this.controlManager = new ControlManager;
    this.webWorker = new Worker("./src/SMWebWorker.js", {type:"module"});
    this.transforms = [];
    this.colors = [];
  }

  createScene(name = "new_scene") {
    let id = uuidv4();
    let scene = { id, name: name };
    this.scenes[id] = scene;
    return scene;
  }

  update(timeStep, unitScale, canvasWidth, canvasHeight) {
    debounce(() => {
      this.webWorker.postMessage({
        timeStep,
        components: this.getComponents(),
        entityIds: this.getEntityIds(),
        unitScale,
        canvasWidth,
        canvasHeight
      });
    }, 100);
    this.webWorker.onmessage = (e) => {
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

  getComponents() {
    return this.components;
  }
}
