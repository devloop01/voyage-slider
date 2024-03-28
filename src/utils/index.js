// Math utilities
export const wrap = (n, max) => (n + max) % max;
export const lerp = (a, b, t) => a + (b - a) * t;

// DOM utilities
export const isHTMLElement = (el) => el instanceof HTMLElement;

export const genId = (() => {
  let count = 0;
  return () => {
    return (count++).toString();
  };
})();
