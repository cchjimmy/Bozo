import EntityManager from "./EntityManager.js";
import uuidv4 from "./utilities/uuidv4.js";

export default class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = this.createScene();
  }

  createScene(name) {
    if (!name) {
      name = "emptyScene";
    }
    let id = uuidv4();
    let scene = { id, name, EntityManager: new EntityManager };
    this.scenes[id] = scene;
    return scene;
  }

  addEntity(entityComponents) {
    return this.currentScene.EntityManager.addEntity(entityComponents);
  }

  update() {

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

  getEntityIds() {
    let ids = []
    let entities = this.currentScene.EntityManager.getEntities();
    // for in returns property name, entity => name of each property in entities, which is the same as entity id
    for (let entity in entities) {
      ids.push(entity);
    }
    return ids;
  }
}