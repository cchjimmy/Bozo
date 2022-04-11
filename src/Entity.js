import Vec2 from "./Vec2.js";

export default class Entity {
  constructor(x = 0, y = 0, texture, speed = 0) {
    
    this.texture = texture;
    this.speed = speed;
    this.pos = new Vec2(x, y)
    this.vel = new Vec2();
    this.acc = new Vec2();
  }
}