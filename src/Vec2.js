export default class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(vec2) {
    this.x += vec2.x; this.y += vec2.y;
    return this;
  }

  multVec(vec2) {
    this.x *= vec2.x; this.y *= vec2.y;
    return this;
  }

  multScal(scalar) {
    this.x *= scalar; this.y *= scalar;
    return this;
  }

  setMag(scalar) {
    if (this.x == 0 && this.y == 0) {
      // creates unit vector
      this.x = 1;
    }
    this.normalize();
    this.multScal(scalar);
    return this;
  }

  mag() {
    return (this.dot(this)) ** 0.5;
  }

  normalize() {
    let magnitude = this.mag();
    this.x /= magnitude; this.y /= magnitude;
    return this;
  }

  dirn() {
    return Math.atan2(this.y, this.x);
  }

  setDirn(rad) {
    let magnitude = this.mag();
    this.x = magnitude * Math.cos(rad); this.y = magnitude * Math.sin(rad);
    return this;
  }

  dist(vec2) {
    let vec = new Vec2(this.x, this.y);
    vec.sub(vec2);
    return vec.mag();
  }

  sub(vec2) {
    this.x -= vec2.x; this.y -= vec2.y;
    return this;
  }

  dot(vec2) {
    let vec = new Vec2(this.x * vec2.x, this.y * vec2.y);
    return vec.x + vec.y;
  }

  cross(vec2) {
    let vec = new Vec2(this.x * vec2.y, this.y * vec2.x);
    return vec.x - vec.y; // magnitude of the vector in z plane
  }
}