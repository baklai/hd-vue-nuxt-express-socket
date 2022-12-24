const Logger = require('../models/logger.model');

module.exports = (io, socket) => {
  const findAll = async (payload, callback) => {
    try {
      const o = Object.assign({}, payload.options);
      const f = Object.assign({}, payload.filters);
      let options = {};
      options.page = o.page || 1;
      if (Number(o.itemsPerPage) === -1) {
        options.limit = await Logger.countDocuments();
      } else {
        options.limit = Number(o.itemsPerPage);
      }
      options.lean = false;
      options.sort = '-datetime';
      options.select = '';
      let filters = {};
      if (f.address) filters.address = { $regex: f.address, $options: 'i' };
      if (f.user) filters.user = { $regex: f.user, $options: 'i' };
      if (f.datetime) filters.datetime = { $regex: f.datetime, $options: 'i' };
      if (f.event) filters.event = { $regex: f.event, $options: 'i' };
      const items = await Logger.paginate({ event: { $exists: true }, ...filters }, { ...options });
      callback(items);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const removeAll = async (payload, callback) => {
    try {
      const item = await Logger.deleteMany({});
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('logger:find:all', findAll);
  socket.on('logger:remove:all', removeAll);
};
