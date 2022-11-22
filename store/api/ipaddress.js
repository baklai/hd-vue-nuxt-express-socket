export const actions = {
  async findAll({ commit }, data) {
    try {
      return await this.$helpdesk.emit('ipaddress:find:all', { ...data });
    } catch (err) {
      this.$toast.error(err);
      return [];
    }
  },

  async findOne({ commit }, id) {
    try {
      return await this.$helpdesk.emit('ipaddress:find:one', { id });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async searchOne({ commit }, ip) {
    try {
      return await this.$helpdesk.emit('ipaddress:search:one', { ip });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async createOne({ commit }, data) {
    try {
      return await this.$helpdesk.emit('ipaddress:create:one', { ...data });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async updateOne({ commit }, data) {
    try {
      return await this.$helpdesk.emit('ipaddress:update:one', { ...data });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async removeOne({ commit }, id) {
    try {
      return await this.$helpdesk.emit('ipaddress:remove:one', { id });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  }
};
