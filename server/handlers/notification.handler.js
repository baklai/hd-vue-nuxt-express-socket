const Notification = require('../models/notification.model');

module.exports = (io, socket) => {
  const findAll = async (payload, callback) => {
    try {
      const items = await Notification.find({ userID: payload.id });
      callback(items);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const createMany = async (payload, callback) => {
    try {
      const { title, text, users } = payload;

      await users.forEach((el) => {
        Notification.create({
          title,
          text,
          userID: el
        });
      });

      callback('Ok');
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const removeOne = async (payload, callback) => {
    try {
      const item = await Notification.deleteOne({ _id: payload.id, userID: payload.UserID });
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('notification:find:all', findAll);
  socket.on('notification:create:many', createMany);
  socket.on('notification:remove:one', removeOne);
};
