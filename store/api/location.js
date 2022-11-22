export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$axios.$get('location');
    } catch (err) {
      commit('setError', err, { root: true });
      return [];
    }
  },

  async findOne({ commit }, id) {
    try {
      return await this.$axios.$get(`location/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async createOne({ commit }, data) {
    try {
      return await this.$axios.$post('location', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async updateOne({ commit }, data) {
    try {
      return await this.$axios.$put(`location/${data.id}`, { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$axios.delete(`location/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
