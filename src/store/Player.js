export default {
  namespaced: true,
  state: () => ({
    height: 1.8,
    speed: {
      look: 5,
    },
  }),
  getters: {
    getHeight: (state) => state.height,
    getLookSpeed: (state) => state.speed.look,
  },
};
