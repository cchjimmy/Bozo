import uuidv4 from "./utilities/uuidv4.js";
import EntityManager from "./EntityManager.js";

export default class SceneManager extends EntityManager {
  constructor() {
    super();
    this.scenes = {};
    this.currentScene = this.createScene();
    this.webWorker = new Worker("./SMWebWorker.js");
    console.log(this.webWorker);
  }

  createScene() {
    let id = uuidv4();
    let scene = { id, entityPool: this.addEntityPool(id) };
    this.scenes[id] = scene;

    this.currentEntityPool = scene.entityPool;
    return scene;
  }

  update(timeStep, id) {
    
    this.components.position[id] = this.components.position[id].add(this.components.velocity[id].mult(timeStep));
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
}
