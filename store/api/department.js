export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$axios.$get('department');
    } catch (err) {
      commit('setError', err, { root: true });
      return [];
    }
  },

  async findOne({ commit }, id) {
    try {
      return await this.$axios.$get(`department/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async createOne({ commit }, data) {
    try {
      return await this.$axios.$post('department', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async updateOne({ commit }, data) {
    try {
      return await this.$axios.$put(`department/${data.id}`, { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$axios.delete(`department/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
