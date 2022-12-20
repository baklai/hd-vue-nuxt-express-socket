const path = require('path');
const dirtree = require('directory-tree');

module.exports = (io, socket) => {
  const findAll = async (payload, callback) => {
    try {
      const items = dirtree(
        path.join(__dirname, '../..', 'public'),
        {
          extensions: /\.(md|pdf|png|txt|xls|doc|docx|zip|rar|cab|exe|msi|msu)$/,
          attributes: ['size', 'type', 'extension', 'atime', 'mtime', 'ctime', 'birthtime'],
          normalizePath: true
        },
        (item) => {
          item.path = item.path.slice(item.path.indexOf('/public'));
        }
      );
      callback(items?.children || []);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('cloud:find:all', findAll);
};
