import EntitiesHandler from "./EntitiesHandler.js";
import uuidv4 from "./utilities/uuidv4.js";

export default class Scene {
  constructor() {
    this.scenes = {};
    this.currentScene = this.createScene("emptyScene");
  }

  createScene(name) {
    let id = uuidv4();
    let scene = {id: id, name: name, EntityHandler: new EntitiesHandler};
    this.scenes[id] = scene;
    return this.scenes[id];
  }

  addEntity({sceneId = this.currentScene.id, entityComponents}) {
    if (!sceneId || this.scenes[sceneId] == undefined) {
      console.warn("Please select a valid scene");
      return;
    }

    this.scenes[sceneId].EntityHandler.addEntity(entityComponents);
  }

  update() {

  }

  getCurrentScene() {
    return this.currentScene;
  }

  getScenes() {
    return this.scenes;
  }
  
  getEntities(sceneId = this.currentScene.id) {
    let entities = this.scenes[sceneId].EntityHandler.getEntities();
    return entities;
  }
}