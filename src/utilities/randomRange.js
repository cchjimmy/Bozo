/**
 * when called return a number between min and max
 * @param {number} min 
 * @param {number} max 
 * @returns a number
 */
export default function randomRange (min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}
