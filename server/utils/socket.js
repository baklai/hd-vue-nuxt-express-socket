const socketUsers = (sockets) => {
  const users = [];
  sockets.forEach((item) => {
    if (item.user) users.push(item.user);
  });
  return users;
};

module.exports = { socketUsers };
