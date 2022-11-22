export const actions = {
  async inspector({ commit }) {
    try {
      return await this.$axios.$get('statistic/inspector');
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async ipaddress({ commit }) {
    try {
      return await this.$axios.$get('statistic/ipaddress');
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async request({ commit }) {
    try {
      return await this.$axios.$get('statistic/request');
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async dashboard({ commit }) {
    try {
      return await this.$axios.$get('statistic/dashboard');
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
