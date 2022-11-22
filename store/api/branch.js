export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$axios.$get('branch');
    } catch (err) {
      commit('setError', err, { root: true });
      return [];
    }
  },

  async findOne({ commit }, id) {
    try {
      return await this.$axios.$get(`branch/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async createOne({ commit }, data) {
    try {
      return await this.$axios.$post('branch', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async updateOne({ commit }, data) {
    try {
      return await this.$axios.$put(`branch/${data.id}`, { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$axios.delete(`branch/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
