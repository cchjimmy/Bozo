import EntitiesHandler from "./EntitiesHandler.js";
import uuidv4 from "./utilities/uuidv4.js";

export default class Scene {
  constructor() {
    this.scenes = {};
    this.currentScene = this.createScene("emptyScene");
  }

  createScene(name) {
    let id = uuidv4();
    let scene = { id: id, name: name, EntityHandler: new EntitiesHandler };
    this.scenes[id] = scene;
    return this.scenes[id];
  }

  addEntity({ sceneId = this.currentScene.id, entityComponents }) {
    let currentScene = this.scenes[sceneId]
    if (!sceneId || currentScene == undefined) {
      console.warn("Please select a valid scene");
      return;
    }

    currentScene.EntityHandler.addEntity(entityComponents);
  }

  update() {

  }

  getCurrentScene() {
    return this.currentScene;
  }

  getScenes() {
    return this.scenes;
  }

  getEntityIds(sceneId = this.currentScene.id) {
    let ids = []
    let entities = this.scenes[sceneId].EntityHandler.getEntities();
    // for in returns property name, entity => name of each property in entities, which is the same as entity id
    for (let entity in entities) {
      ids.push(entity);
    }
    return ids;
  }
}