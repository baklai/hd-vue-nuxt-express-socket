const socketIO = require('socket.io');

const { MONGO_URI, BCRYPT_SALT } = require('./config/api.config');

const connectToMongo = require('./utils/database');

connectToMongo(MONGO_URI, BCRYPT_SALT);

const authHandler = require('./handlers/auth.handler');
const userHandler = require('./handlers/user.handler');
const toolHandler = require('./handlers/tool.handler');
const locationHandler = require('./handlers/location.handler');
const positionHandler = require('./handlers/position.handler');
const unitHandler = require('./handlers/unit.handler');
const companyHandler = require('./handlers/company.handler');
const branchHandler = require('./handlers/branch.handler');
const enterpriseHandler = require('./handlers/enterprise.handler');
const departmentHandler = require('./handlers/department.handler');
const channelHandler = require('./handlers/channel.handler');
const vpnHandler = require('./handlers/vpn.handler');
const ipaddressHandler = require('./handlers/ipaddress.handler');
const requestHandler = require('./handlers/request.handler');
const inspectorHandler = require('./handlers/inspector.handler');
const notificationHandler = require('./handlers/notification.handler');
const eventHandler = require('./handlers/event.handler');
const statisticHandler = require('./handlers/statistic.handler');
const loggerHandler = require('./handlers/logger.handler');

const authMiddleware = require('./middleware/auth');
const scopeMiddleware = require('./middleware/scope');
const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

class Users {
  constructor() {
    this.users = [];
  }
  add(user) {
    this.users.push(user);
  }
  get(id) {
    return this.users.find((user) => user.id === id);
  }
  remove(id) {
    const user = this.get(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }
  getByRoom(room) {
    return this.users.filter((user) => user.room === room);
  }
}

const users = new Users();

const msg = (name, text, id) => ({ name, text, id, date: Date.now() });

module.exports = (server, options) => {
  const io = socketIO(server, options);

  // io.use((socket, next) => {
  //   console.log('socket', socket);
  //   next();
  // });

  const onConnection = function (socket) {
    socket.use(authMiddleware(socket, ['auth:signin']));
    socket.use(
      scopeMiddleware(socket, [
        'auth:signin',
        'auth:signout',
        'notification:find:all',
        'notification:remove:one'
      ])
    );
    socket.use(loggerMiddleware(socket, ['logger:find:all', 'logger:remove:all']));

    authHandler(io, socket);
    userHandler(io, socket);
    //  toolHandler(io, socket);
    locationHandler(io, socket);
    positionHandler(io, socket);
    unitHandler(io, socket);
    companyHandler(io, socket);
    branchHandler(io, socket);
    enterpriseHandler(io, socket);
    departmentHandler(io, socket);
    channelHandler(io, socket);
    vpnHandler(io, socket);
    ipaddressHandler(io, socket);
    requestHandler(io, socket);
    inspectorHandler(io, socket);
    notificationHandler(io, socket);
    eventHandler(io, socket);
    statisticHandler(io, socket);
    loggerHandler(io, socket);

    socket.on('error', errorMiddleware(socket, 'api:error'));

    // socket.on('disconnect', () => {
    //   const user = users.remove(socket.id);
    //   if (user) {
    //     io.emit('updateUsers', users.getByRoom(user.room));
    //     io.emit('newMessage', msg('info', `Пользователь ${user.name} вышел.`));
    //   }
    // });

    // socket.on('userJoined', (data, callback) => {
    //   if (!data.name || !data.room) {
    //     return callback('Данные некорректны');
    //   }
    //   socket.join(data.room);
    //   users.remove(socket.id);
    //   users.add({
    //     id: socket.id,
    //     name: data.name,
    //     room: data.room
    //   });
    //   callback({ userId: socket.id });
    //   io.emit('updateUsers', users.getByRoom(data.room));
    //   socket.emit('newMessage', msg('info', `Добро пожаловать ${data.name}`));
    //   // socket.broadcast
    //   //   .emit('newMessage', msg('info', `Пользователь ${data.name} зашел.`));
    // });

    // socket.on('createMessage', (data, callback) => {
    //   if (!data.text) {
    //     return callback('Текст не может быть пустым');
    //   }
    //   const user = users.get(data.id);
    //   if (user) {
    //     io.emit('newMessage', msg(user.name, data.text, data.id));
    //   }
    //   callback();
    // });

    // socket.on('userLeft', (id, callback) => {
    //   const user = users.remove(id);
    //   if (user) {
    //     io.emit('updateUsers', users.getByRoom(user.room));
    //     // io
    //     //   .emit(
    //     //     'newMessage',
    //     //     msg('info', `Пользователь ${user.name} вышел.`)
    //     //   );
    //   }
    //   callback();
    // });
  };

  io.on('connection', onConnection);
};
