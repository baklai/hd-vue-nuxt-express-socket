export const actions = {
  async getVBS({ commit }) {
    try {
      return await this.$axios.$get(`tool/inspector`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async getRDP({ commit }, ip) {
    try {
      return await this.$axios.$get(`tool/rdp`, { ip });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async getVNC({ commit }, ip) {
    try {
      return await this.$axios.$get(`tool/vnc`, { ip });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async getPING({ commit }, ip) {
    try {
      return await this.$axios.$get(`tool/ping`, { ip });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async getOPING({ commit }, ip) {
    try {
      return await this.$axios.$get(`tool/ping-online`, { ip });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
