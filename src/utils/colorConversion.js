// https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hexadecimal-in-javascript
/**
 * Converts a hexadecimal string to a decimal number
 * @param {string} hex 
 * @returns {number}
 */
export function hexToDec(hex) {
  return parseInt(hex, 16);
}

/**
 * Converts a decimal number to a hexadecimal string
 * @param {number} x 
 * @returns {string}
 */
export function decToHex(x) {
  return x.toString(16);
}

/**
 * Converts a hex color value to a RGB color value
 * @param {string} hexColor
 * @return {array}
 */
export function colorHexToRGB(hexColor) {
  let result;
  result = hexColor.slice(1);
  result = [result.slice(0, 2), result.slice(2, 4), result.slice(4)];
  for (let i = 0; i < result.length; i++) {
    result[i] = hexToDec(result[i]);
  }
  return result;
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
/**
 * Converts a RGB color value to hex color value
 * @param {array} color [ r, g, b ]
 * @returns {string}
 */
export function colorRGBToHex(color) {
  let result = '#';
  for (let i = 0; i < color.length; i++) {
    result += decToHex(color[i]).length == 1 ? '0' + decToHex(color[i]) : decToHex(color[i]);;
  }
  return result;
}