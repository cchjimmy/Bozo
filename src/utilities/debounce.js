// https://stackoverflow.com/questions/63301553/debounce-function-not-working-in-javascript
// https://www.freecodecamp.org/news/javascript-debounce-example/
(function() {
  var timer = {};
  /**
   * when called, timeout is cleared and the input function is called after the timeout
   * @param {executionContext} context the execution context for the input function
   * @param {function} func the input function to be debounced
   * @param {number} timeout timeout before function execution
   * @returns a function to be called
   */
  function debounce({ context = this, func = () => { }, timeout = 300 }) {
    return ((...args) => {
      clearTimeout(timer[func]);
      timer[func] = setTimeout(() => { func.apply(context, args); delete timer[func]; }, timeout);
    })();
  }
})();