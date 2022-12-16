const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const { toResponse } = require('../models/user.model');

const { JWT_SECRET_KEY } = require('../config');

module.exports = (socket, unless) => {
  return async ([event, ...args], next) => {
    if (unless.includes(event)) return next();
    if (
      socket.handshake.auth &&
      socket.handshake.auth.token &&
      typeof socket.handshake.auth.token === 'string'
    ) {
      jwt.verify(socket.handshake.auth.token, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error, invalid token supplied'));
        }
        const user = await User.findById(decoded.id);
        if (!user)
          return next(
            new Error('Invalid login or password, kindly contact the admin if this is an anomaly')
          );
        if (!user.isActive) return next(new Error('Authentication error, account is inactive'));
        socket.user = toResponse(user);

        return next();
      });
    } else {
      return next(new Error('Authentication error, Please provide a token'));
    }
  };
};
