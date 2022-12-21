process.on('uncaughtException', (err) => {
  console.log(err);
  console.error(`${new Date().toUTCString()} uncaughtException: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(`${new Date().toUTCString()} unhandledRejection: ${reason.message}`);
});

const handleValidationError = (err) => {
  let message;
  const key = Object.keys(err.errors);
  if (err.errors[key[0]] && err.errors[key[0]].properties) {
    message = err.errors[key[0]].properties.message;
  }
  return message;
};

module.exports = (socket, event) => {
  return (err) => {
    if (err.name === 'UnauthorizedError') {
      socket.emit(event, 'Oops! The token is invalid');
    } else if (err.name === 'ScopedError') {
      socket.emit(event, 'Oops! Access to the resource is denied');
    } else if (err.name === 'ValidationError') {
      socket.emit(event, handleValidationError(err));
    } else if (err.name === 'MongoServerError') {
      socket.emit(event, err.message);
    } else {
      socket.emit(event, err.message);
    }
  };
};
