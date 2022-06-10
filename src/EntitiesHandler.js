import Vec2 from "./Vec2.js";

export default class EntitiesHandler {
  constructor(context) {
    this.c = context;
    this.entities = [];
    this.entity = {
      position: new Vec2,
      width: undefined,
      height: undefined,
      velocity: new Vec2,
    }
  }

  update() {
    this.entities.forEach((entity) => {
      this.c.fillRect(entity.position.x, entity.position.y, entity.width, entity.height);
      this.entity.position.add(entity.velocity);
    })
  }

  addEntity(x = 0, y = 0, width = 10, height = 10) {
    this.entity.position.x = x;
    this.entity.position.y = y;
    this.entity.width = width;
    this.entity.height = height;
    // this.entity.velocity.x = 1;
    this.entities.push(this.entity);
  }
}