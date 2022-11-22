export const actions = {
  async findAll({ commit }, data) {
    try {
      return await this.$axios.$get('ipaddress', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return [];
    }
  },

  async findOne({ commit }, id) {
    try {
      return await this.$axios.$get(`ipaddress/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async searchOne({ commit }, ip) {
    try {
      return await this.$axios.$get(`ipaddress/search/${ip}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async createOne({ commit }, data) {
    try {
      return await this.$axios.$post('ipaddress', { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async updateOne({ commit }, data) {
    try {
      return await this.$axios.$put(`ipaddress/${data.id}`, { ...data });
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$axios.delete(`ipaddress/${id}`);
    } catch (err) {
      commit('setError', err, { root: true });
      return null;
    }
  }
};
