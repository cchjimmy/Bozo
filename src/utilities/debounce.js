// credit: https://stackoverflow.com/questions/63301553/debounce-function-not-working-in-javascript
let timer;
/**
 * when called, timeout is cleared and the input function is called after the timeout
 * @param {function} func 
 * @param {number} timeout 
 * @returns a function to be called
 */
export default function debounce(func = () => {}, timeout = 300) {
  return ((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  })();
}