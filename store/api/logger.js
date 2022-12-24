export const actions = {
  async findAll({ commit }, data) {
    try {
      return await this.$helpdesk.emit('logger:find:all', { ...data });
    } catch (err) {
      this.$toast.error(err);
      return [];
    }
  },

  async removeAll({ commit }) {
    try {
      return await this.$helpdesk.emit('logger:remove:all', {});
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  }
};
