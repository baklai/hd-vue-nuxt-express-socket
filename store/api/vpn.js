export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$helpdesk.emit('vpn:find:all', {});
    } catch (err) {
      this.$toast.error(err);
      return [];
    }
  },

  async findOne({ commit }, id) {
    try {
      return await this.$helpdesk.emit('vpn:find:one', { id });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async createOne({ commit }, data) {
    try {
      return await this.$helpdesk.emit('vpn:create:one', { ...data });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async updateOne({ commit }, data) {
    try {
      return await this.$helpdesk.emit('vpn:update:one', { ...data });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$helpdesk.emit('vpn:remove:one', { id });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  }
};
