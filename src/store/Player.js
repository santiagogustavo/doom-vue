export default {
  namespaced: true,
  state: () => ({
    height: 1.8,
    fov: 90,
    speed: {
      move: 6,
      look: 3,
    },
  }),
  getters: {
    getHeight: (state) => state.height,
    getFov: (state) => state.fov,
    getLookSpeed: (state) => state.speed.look,
    getMoveSpeed: (state) => state.speed.move,
  },
};
