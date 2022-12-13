const Netmask = require('netmask').Netmask;

const IPAddress = require('../models/ipaddress.model');

module.exports = (io, socket) => {
  const findAll = async (payload, callback) => {
    try {
      const o = Object.assign({}, payload.options);
      const f = Object.assign({}, payload.filters);
      let options = {};
      options.page = o.page || 1;
      if (Number(o.itemsPerPage) === -1) {
        options.limit = await IPAddress.countDocuments();
      } else {
        options.limit = Number(o.itemsPerPage);
      }
      options.lean = false;
      options.sort = 'indexip'; // o.sortBy ? [o.sortBy, o.sortDesc] : 'indexip';
      options.select = '-cidr';
      let filters = {};
      if (f.unit) filters.unit = f.unit;
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
      if (f.autoanswer) filters.autoanswer = { $regex: f.autoanswer, $options: 'i' };
      if (f.internet) {
        filters['internet.mail'] = { $ne: null };
        filters['internet.dateOpen'] = { $ne: null };
        filters['internet.dateClose'] = null;
      }
      if (f.email) {
        filters['email.login'] = { $ne: null };
        filters['email.mail'] = { $ne: null };
        filters['email.dateOpen'] = { $ne: null };
        filters['email.dateClose'] = null;
      }
      const items = await IPAddress.paginate({ ...filters }, { ...options });
      callback(items);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const findOne = async (payload, callback) => {
    try {
      const item = await IPAddress.findById(payload.id);
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const searchOne = async (payload, callback) => {
    try {
      const item = await IPAddress.findOne({ ipaddress: payload.ip });
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const createOne = async (payload, callback) => {
    try {
      const indexip = new Netmask(payload.ipaddress).netLong;
      const item = await IPAddress.create({ ...payload, indexip });
      callback(item);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const updateOne = async (payload, callback) => {
    try {
      const indexip = new Netmask(payload.ipaddress).netLong;

      const item = await IPAddress.findByIdAndUpdate(payload.id, {
        $set: {
          ...payload,
          indexip
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
      const item = await IPAddress.deleteOne({ _id: payload.id });
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('ipaddress:find:all', findAll);
  socket.on('ipaddress:find:one', findOne);
  socket.on('ipaddress:search:one', searchOne);
  socket.on('ipaddress:create:one', createOne);
  socket.on('ipaddress:update:one', updateOne);
  socket.on('ipaddress:remove:one', removeOne);
};
