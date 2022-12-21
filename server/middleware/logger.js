const Logger = require('../models/logger.model');

const eventStr = (event) => {
  const [model, ...args] = event.split(':');
  if (event.includes('find')) return `READ ${model.toUpperCase()} [${event}]`;
  else if (event.includes('create')) return `CREATE ${model.toUpperCase()} [${event}]`;
  else if (event.includes('update')) return `UPDATE ${model.toUpperCase()} [${event}]`;
  else if (event.includes('remove')) return `DELETE ${model.toUpperCase()} [${event}]`;
  else return `GET ${model.toUpperCase()} [${event}]`;
};

module.exports = (socket, unless) => {
  return async ([event, ...args], next) => {
    if (unless.includes(event)) return next();
    const log = await Logger.create({
      address: socket.handshake.address
        ? socket.handshake.address.replace(/^.*:/, '')
        : 'anonymous',
      user: socket?.user?.login ? socket.user.login : 'anonymous',
      event: event,
      datetime: socket?.handshake?.time
        ? new Date(socket.handshake.time).toLocaleString()
        : new Date().toLocaleString(),
      agent: socket?.handshake?.headers['user-agent']
        ? socket.handshake.headers['user-agent']
        : 'anonymous'
    });
    console.log(
      `${log.address} [${log.user}] - ${eventStr(log.event)} [${log.datetime}] "${log.agent}"`
    );
    return next();
  };
};
