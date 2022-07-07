export default class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * adds input vec2 to current vec2
   * @param {Vec2} vec2 
   * @returns a vec2
   */
  add(vec2) {
    return new Vec2(this.x + vec2.x, this.y + vec2.y);
  }

  /**
   * multiplies current vec2 with input vec2
   * @param {Vec2} vec2 
   * @returns a vec2
   */
  mult(vec2) {
    return new Vec2(this.x * vec2.x, this.y * vec2.y);
  }

  /**
   * sets magnitude of current vec2
   * @param {Number} scalar desire magnitude
   * @returns a vec2
   */
  setMag(scalar) {
    if (this.mag() == 0) {
      // creates an unit vector
      this.x = 1;
    }
    return this.normalize().mult(new Vec2(scalar, scalar));
  }

  /**
   * calculates magnitude of current vec2
   * @returns a scalar value
   */
  mag() {
    return (this.dot(this)) ** 0.5;
  }

  /**
   * sets magnitude of current vec2 into 1
   * @returns a vec2
   */
  normalize() {
    let magnitude = this.mag();
    return new Vec2(this.x / magnitude, this.y / magnitude);
  }

  /**
   * calculates direction of current vec2 relative to positive x-axis
   * @returns an angle in radians
   */
  dirn() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * sets direction of vec2 from positive x-axis in radians, regardless of original direction
   * @param {Number} rad input angle in radians
   * @returns a vec2
   */
  setDirn(rad) {
    let magnitude = this.mag();
    return new Vec2(magnitude * Math.cos(rad), magnitude * Math.sin(rad));
  }

  /**
   * calculates distance between current vec2 and input vec2
   * @param {Vec2} vec2 
   * @returns a scalar value
   */
  dist(vec2) {
    let vec = new Vec2(this.x, this.y);
    return vec.sub(vec2).mag();
  }

  /**
   * subtracts current vec2 with input vec2
   * @param {Vec2} vec2 
   * @returns a vec2
   */
  sub(vec2) {
    return new Vec2(this.x - vec2.x, this.y - vec2.y);
  }

  /**
   * calculates dot product between current vec2 and input vec2
   * @param {Vec2} vec2 
   * @returns a scalar value
   */
  dot(vec2) {
    let vec = new Vec2(this.x * vec2.x, this.y * vec2.y);
    return vec.x + vec.y;
  }

  /**
   * calculates cross product between current vec2 and input vec2 -> the determinant
   * @param {Vec2} vec2 
   * @returns a scalar value -> magnitude of vector in z-plane
   */
  cross(vec2) {
    let vec = new Vec2(this.x * vec2.y, this.y * vec2.x);
    return vec.x - vec.y;
  }
}