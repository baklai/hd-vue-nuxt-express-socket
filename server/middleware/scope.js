const User = require('../models/user.model');

module.exports = (socket, unless) => {
  return async ([event, ...args], next) => {
    if (unless.includes(event)) return next();
    if (!socket.user) return next(new Error('Authentication error, invalid user supplied'));
    if (!socket.user.isActive) return next(new Error('You are account not is active'));
    if (socket.user.isAdmin) return next();
    const { scope: userScopes } = await User.findById(socket.user.id);
    const isAllowed = userScopes.includes(event) ? true : false;
    return isAllowed ? next() : next(new Error('You are not authorized to access this resource'));
  };
};
