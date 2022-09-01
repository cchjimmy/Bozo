import ECS from "./ECS.js";
import Vec2 from "./utilities/Vec2.js";

export class Movement extends ECS.prototype.Component {
  position = new Vec2;
  velocity = new Vec2;
}

export class Appearance extends ECS.prototype.Component {
  size = new Vec2(1, 1);
  color = "white";
}