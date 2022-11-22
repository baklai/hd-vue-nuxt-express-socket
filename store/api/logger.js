export const actions = {
  async findAll({ commit }, data) {
    try {
      return await this.$axios.$get('logger', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return [];
    }
  },

  async removeAll({ commit }) {
    try {
      return await this.$axios.delete('logger');
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
