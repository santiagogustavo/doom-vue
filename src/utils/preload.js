export const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

export const preloadAudio = (src) => {
  new Audio(src);
};
