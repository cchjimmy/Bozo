import EntityManager from "./EntityManager.js";
import uuidv4 from "./utilities/uuidv4.js";

export default class SceneManager extends EntityManager{
  constructor() {
    super();
    this.scenes = {};
    this.currentScene = this.createScene();
  }

  createScene(name) {
    if (!name) {
      name = "emptyScene";
    }
    let id = uuidv4();
    let scene = { id, name, entities: this.entities[id] };
    this.scenes[id] = scene;
    return scene;
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
}