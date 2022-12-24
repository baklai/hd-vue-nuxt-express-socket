export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$helpdesk.emit('notification:find:all', {});
    } catch (err) {
      this.$toast.error(err);
      return [];
    }
  },

  async createMany({ commit }, data) {
    try {
      return await this.$helpdesk.emit('notification:create:many', { ...data });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$helpdesk.emit('notification:remove:one', { id });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  }
};
