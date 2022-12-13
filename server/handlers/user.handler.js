const bcrypt = require('bcrypt');

const User = require('../models/user.model');

const { toResponse } = require('../models/user.model');

const { BCRYPT_SALT } = require('../config');

module.exports = (io, socket) => {
  const findAll = async (payload, callback) => {
    try {
      const items = await User.find({});
      callback(items.map(toResponse));
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const findOne = async (payload, callback) => {
    try {
      const item = await User.findById(payload.id);
      if (item) callback(toResponse(item));
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const createOne = async (payload, callback) => {
    try {
      const password = await bcrypt.hash(payload.password, BCRYPT_SALT);
      const item = await User.create({ ...payload, password });
      callback(toResponse(item));
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const updateOne = async (payload, callback) => {
    try {
      const { password, ...args } = payload;
      const item = password
        ? await User.findByIdAndUpdate(payload.id, {
            ...args,
            password: await bcrypt.hash(password, BCRYPT_SALT)
          })
        : await User.findByIdAndUpdate(payload.id, { ...args });

      if (item) callback(toResponse(item));
      else callback(400);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const removeOne = async (payload, callback) => {
    try {
      const item = await User.deleteOne({ _id: payload.id });
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('user:find:all', findAll);
  socket.on('user:find:one', findOne);
  socket.on('user:create:one', createOne);
  socket.on('user:update:one', updateOne);
  socket.on('user:remove:one', removeOne);
};
