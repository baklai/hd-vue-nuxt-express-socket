const bcrypt = require('bcrypt');
const { Array } = require('core-js');

const User = require('../models/user.model');
const { toResponse, toSocket } = require('../models/user.model');

const socketUsers = (sockets) => {
  const users = [];
  sockets.forEach((item) => {
    if (item.user) users.push(item.user);
  });
  return users;
};

module.exports = (io, socket) => {
  const signin = async (payload, callback) => {
    try {
      const { login, password } = payload;
      const user = await User.findOne({ login });
      if (!user) return callback({ error: 'User is not found' });
      if (!user.isActive) return callback({ error: 'Account is disabled' });
      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) return callback({ error: 'The password is incorrect' });
      socket.user = toSocket(user);
      socket.broadcast.emit('helpdesk:message', `${user.name} зашел в систему.`);
      socket.emit('helpdesk:message', `${user.name} добро пожаловать.`);
      const users = socketUsers(io.sockets.sockets);
      io.emit('helpdesk:users', users);
      callback(toResponse(user));
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const signout = async (payload, callback) => {
    try {
      socket.user = null;
      const users = socketUsers(io.sockets.sockets);
      io.emit('helpdesk:users', users);
      callback('Ok');
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('auth:signin', signin);
  socket.on('auth:signout', signout);
};
