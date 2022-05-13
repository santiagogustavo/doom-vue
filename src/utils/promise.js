export const timeout = (callback, delta) =>
  new Promise((resolve) => {
    callback();
    setTimeout(resolve, delta);
  });
