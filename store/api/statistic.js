export const actions = {
  async inspector({ commit }) {
    try {
      return await this.$helpdesk.emit('statistic:inspector', {});
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async ipaddress({ commit }) {
    try {
      return await this.$helpdesk.emit('statistic:ipaddress', {});
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async request({ commit }) {
    try {
      return await this.$helpdesk.emit('statistic:request', {});
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  },

  async dashboard({ commit }) {
    try {
      return await this.$helpdesk.emit('statistic:dashboard', {});
    } catch (err) {
      this.$toast.error(err);
      return null;
    }
  }
};
