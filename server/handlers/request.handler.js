const Request = require('../models/request.model');

module.exports = (io, socket) => {
  const findAll = async (payload, callback) => {
    try {
      const o = Object.assign({}, payload.options);
      const f = Object.assign({}, payload.filters);
      let options = {};
      options.page = o.page || 1;
      if (Number(o.itemsPerPage) === -1) {
        options.limit = await Request.countDocuments();
      } else {
        options.limit = Number(o.itemsPerPage);
      }
      options.lean = false;
      options.sort = '-createdAt'; // o.sortBy ? [o.sortBy, o.sortDesc] : 'createdAt';
      options.select = '';
      let filters = {};
      if (f.workerOpen) filters.workerOpen = f.workerOpen;
      if (f.workerClose) filters.workerClose = f.workerClose;
      if (f.location) filters.location = f.location;
      if (f.position) filters.position = f.position;
      if (f.company) filters.company = f.company;
      if (f.branch) filters.branch = f.branch;
      if (f.enterprise) filters.enterprise = f.enterprise;
      if (f.department) filters.department = f.department;
      if (f.ipaddress) filters.ipaddress = { $regex: f.ipaddress, $options: 'i' };
      if (f.fullname) filters.fullname = { $regex: f.fullname, $options: 'i' };
      if (f.phone) filters.phone = { $regex: f.phone, $options: 'i' };
      if (f.mail) filters.mail = { $regex: f.mail, $options: 'i' };
      if (f.closed) filters.closed = { $ne: null };
      const items = await Request.paginate({ ...filters }, { ...options });
      callback(items);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const findOne = async (payload, callback) => {
    try {
      const item = await Request.findById(payload.id);
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const createOne = async (payload, callback) => {
    try {
      const item = await Request.create({ ...payload });
      callback(item);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const updateOne = async (payload, callback) => {
    try {
      const item = await Request.findByIdAndUpdate(payload.id, {
        $set: {
          ...payload
        }
      });
      if (item) callback(item);
      else callback(400);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const removeOne = async (payload, callback) => {
    try {
      const item = await Request.deleteOne({ _id: payload.id });
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('request:find:all', findAll);
  socket.on('request:find:one', findOne);
  socket.on('request:create:one', createOne);
  socket.on('request:update:one', updateOne);
  socket.on('request:remove:one', removeOne);
};
