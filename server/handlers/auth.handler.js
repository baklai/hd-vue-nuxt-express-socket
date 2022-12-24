const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const { toResponse, toSocket } = require('../models/user.model');

const { socketUsers } = require('../utils/socket');

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
      socket.broadcast.emit('helpdesk:message', `${user.name} is logged in`);
      socket.emit('helpdesk:message', `${user.name} welcome`);
      const users = socketUsers(io.sockets.sockets);
      io.emit('helpdesk:users', users);
      callback(toResponse(user));
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('auth:signin', signin);
};
