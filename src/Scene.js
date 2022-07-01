import EntitiesHandler from "./EntitiesHandler.js";
import uuidv4 from "./uuidv4.js";

export default class Scene {
  constructor() {
    this.scenes = {};
    this.currentScene = this.createScene("emptyScene");
  }

  createScene(name) {
    let id = uuidv4();
    let scene = {id: id, name: name, EntityHandler: new EntitiesHandler};
    this.scenes[id] = scene;
    return scene;
  }

  addEntity({sceneId = this.currentScene.id, entityComponents}) {
    if (!sceneId) {
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
}