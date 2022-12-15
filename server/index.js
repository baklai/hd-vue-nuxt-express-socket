const cors = require('cors');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const compression = require('compression');
const express = require('express');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '..', '.env.prod')
      : path.join(__dirname, '..', '.env.dev')
});

const { PORT, HOST, MONGO_URI, BCRYPT_SALT } = require('./config');

const connectToMongo = require('./utils/database');

connectToMongo(MONGO_URI, BCRYPT_SALT);

const expressError = require('./middleware/error-express');

const app = express();

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', '200.html'));
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Oops! Error 404 has occurred' });
});

app.use((err, req, res, next) => {
  expressError(err, res);
});

const server = http.createServer(app);

const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000,
  allowEIO3: true,
  cors: {
    origin: '*',
    credentials: true
  },
  path: '/api'
});

const authMiddleware = require('./middleware/auth');
const scopeMiddleware = require('./middleware/scope');
const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error-socket');

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

io.on('connection', async (socket) => {
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
  toolHandler(io, socket);
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

  // io.sockets.sockets.forEach(function (data, counter) {
  //   console.log('counter', counter);
  //   console.log('data', data);
  // });

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
});

server.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
