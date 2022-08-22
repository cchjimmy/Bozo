import ECS from "./ECS.js";
import Vec2 from "./utilities/Vec2.js";

export const components = {
  Movement: class Movement extends ECS.prototype.Component {
    position = new Vec2;
    velocity = new Vec2;
  },

  Appearance: class Appearance extends ECS.prototype.Component {
    size = new Vec2(1, 1);
    color = "white";
  },
}