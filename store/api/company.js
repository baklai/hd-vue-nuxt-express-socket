export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$axios.$get('company');
    } catch (err) {
      commit('setError', err, { root: true });
      return [];
    }
  },

  async findOne({ commit }, id) {
    try {
      return await this.$axios.$get(`company/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async createOne({ commit }, data) {
    try {
      return await this.$axios.$post('company', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async updateOne({ commit }, data) {
    try {
      return await this.$axios.$put(`company/${data.id}`, { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$axios.delete(`company/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
