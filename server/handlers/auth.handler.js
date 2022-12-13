const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const { toResponse, toToken } = require('../models/user.model');

const { JWT_SECRET_KEY, TOKEN_EXPIRES_IN } = require('../config');

module.exports = (io, socket) => {
  const signin = async (payload, callback) => {
    try {
      const { login, password } = payload;
      const user = await User.findOne({ login });
      if (!user) return callback({ error: 'User is not found' });
      if (!user.isActive) return callback({ error: 'Account is disabled' });
      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) return callback({ error: 'The password is incorrect' });
      const token = jwt.sign(toToken(user), JWT_SECRET_KEY, {
        expiresIn: TOKEN_EXPIRES_IN
      });
      socket.handshake.auth.token = token;
      callback(toResponse(user));
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const signout = async (payload, callback) => {
    try {
      socket.handshake.auth.token = null;
      callback('Ok');
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('auth:signin', signin);
  socket.on('auth:signout', signout);
};
