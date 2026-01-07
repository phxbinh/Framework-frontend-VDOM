// ✳️simple debounce
function debounce(fn, wait = 150) {
  let timer, lastArgs, lastThis;

  function debounced(...args) {
    clearTimeout(timer);
    lastArgs = args;
    lastThis = this;
    timer = setTimeout(() => {
      fn.apply(lastThis, lastArgs);
      timer = null;
    }, wait);
  }

  debounced.cancel = () => clearTimeout(timer);

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      fn.apply(lastThis, lastArgs);
      timer = null;
    }
  };

  return debounced;
}
