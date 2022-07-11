export default class ControlManager {
  constructor() {
    this.controllers = {};
    this.keys = {};
    this.bindings = {};

    window.onkeydown = (e) => {
      this.keys[e.key] = true;
      this.update(this.currentEntityPool);
    }
    window.onkeyup = (e) => {
      delete this.keys[e.key];
    }
  }

  createController(id, callback) {
    this.controllers[id] = {id, callback};
  }

  update(entityPool) {
    for (let entity in entityPool.entities) {
      if (this.controllers[entity]) {
        this.controllers[entity].callback();
      }
    }
  }

  setCurrentEntityPool(entityPool) {
    this.currentEntityPool = entityPool;
  }
}