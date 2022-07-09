import uuidv4 from "./utilities/uuidv4.js";
import EntityManager from "./EntityManager.js";
import Vec2 from "./utilities/Vec2.js";

export default class SceneManager extends EntityManager{
  constructor() {
    super();
    this.scenes = {};
    this.currentScene = this.createScene();
  }

  createScene() {
    let id = uuidv4();
    let scene = { id, entityPool: this.addEntityPool(id)};
    this.scenes[id] = scene;
    
    this.currentEntityPool = scene.entityPool;
    return scene;
  }

  update(timeStep) {
    let entities = this.currentEntityPool.entities;
    
    for (let entity in entities) {
      if (entities[entity].velocity) {
        entities[entity].position = entities[entity].position.add(entities[entity].velocity.mult(new Vec2(timeStep, timeStep)));
      }
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
}
