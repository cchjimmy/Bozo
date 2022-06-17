import Vec2 from "./Vec2.js";

export default class EntitiesHandler {
  constructor(context) {
    this.c = context;
    this.entities = [];
  }

  update() {
    this.entities.forEach(entity => {
      this.c.fillRect(entity.position.x, -entity.position.y, entity.size.x, entity.size.y);
      entity.position = entity.position.add(entity.velocity);
    })
  }

  /**
   * adds an entity into entity handler
   * @param {*} params {position: vec2, size: vec2, velocity: vec2}
   */
  addEntity(params) {
    let p = {
      position: new Vec2,
      size: new Vec2(10, 10),
      velocity: new Vec2
    }

    if (params != undefined) {
      for (let param in params) {
        p[param] = params[param];
      }
    }

    let entity = p;
    this.entities.push(p);
  }
}