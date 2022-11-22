export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$axios.$get('notification');
    } catch (err) {
      commit('setError', err, { root: true });
      return [];
    }
  },

  async createMany({ commit }, data) {
    try {
      return await this.$axios.$post('notification', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$axios.delete(`notification/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
