export const actions = {
  async findAll({ commit }) {
    try {
      return await this.$helpdesk.emit('cloud:find:all', {});
    } catch (err) {
      this.$toast.error(err);
      return [];
    }
  }
};
