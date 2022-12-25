const SOCKET_TIMEOUT = 60;

module.exports = (socket, unless) => {
  return async ([event, ...args], next) => {
    if (unless.includes(event)) return next();
    socket.emit('helpdesk:timeout', SOCKET_TIMEOUT);
    return next();
  };
};
