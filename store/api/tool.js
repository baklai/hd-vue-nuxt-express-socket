export const actions = {
  async getVBS({ commit }) {
    try {
      return await this.$helpdesk.emit('tool:inspector');
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async getRDP({ commit }, ip) {
    try {
      return await this.$helpdesk.emit('tool:rdp', { ip });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async getVNC({ commit }, ip) {
    try {
      return await this.$helpdesk.emit('tool:vnc', { ip });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async getPING({ commit }, ip) {
    try {
      return await this.$helpdesk.emit('tool:ping', { ip });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async getOPING({ commit }, ip) {
    try {
      return await this.$helpdesk.emit('tool:ping-online', { ip });
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  }
};
