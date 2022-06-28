import uuidv4 from "./uuid.js";
import Vec2 from "./Vec2.js";

export default class EntitiesHandler {
  constructor() {
    this.entities = [];
  }

  update() {
    this.entities.forEach(entity => {
      entity.position = entity.position.add(entity.velocity);
    })
  }

  /**
   * adds an entity into entity handler
   * @param {*} params {position: vec2, halfSize: vec2, velocity: vec2}
   */
  addEntity(params) {
    let p = {
      position: new Vec2,
      halfSize: new Vec2(0.5, 0.5),
      velocity: new Vec2,
      id: uuidv4()
    }

    if (params) {
      for (let param in params) {
        p[param] = params[param];
      }
    }

    this.entities.push(p);
  }

  /**
   * returns an array of all entities
   * @returns an array
   */
  getEntities() {
    return this.entities;
  }
}