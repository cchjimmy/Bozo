// credit: https://stackoverflow.com/questions/63301553/debounce-function-not-working-in-javascript
let timer;
export default function debounce(func, timeout = 300) {
  return ((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  })();
}