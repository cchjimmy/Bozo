import uuidv4 from "./utilities/uuidv4.js";
import EntityManager from "./EntityManager.js";
import Vec2 from "./utilities/Vec2.js";

export default class SceneManager extends EntityManager {
  constructor() {
    super();
    this.scenes = {};
    this.currentScene = this.createScene();
  }

  createScene() {
    let id = uuidv4();
    let scene = { id, entityPool: this.addEntityPool(id) };
    this.scenes[id] = scene;

    this.currentEntityPool = scene.entityPool;
    return scene;
  }

  update(timeStep, object) {
    if (!object) return;
    const deltaTime = new Vec2(timeStep, timeStep);
    object.position = object.position.add(object.velocity.mult(deltaTime));
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
