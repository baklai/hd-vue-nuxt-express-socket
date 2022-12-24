const socketUsers = (sockets) => {
  const users = [];
  sockets.forEach((item) => {
    if (item.user) users.push(item.user);
  });
  return users.reduce(
    (prev, curr) => (
      prev.map((item) => item.id).includes(curr.id) || prev.push(curr), prev
    ),
    []
  );
};

module.exports = { socketUsers };
