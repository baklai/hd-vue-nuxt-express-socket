const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const { Server } = require('socket.io');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '..', '.env.prod')
      : path.join(__dirname, '..', '.env.dev')
});

const { PORT, HOST, MONGO_URI, BCRYPT_SALT, JWT_SECRET_KEY } = require('./config/api.config');

const connectToMongo = require('./utils/database');

connectToMongo(MONGO_URI, BCRYPT_SALT);

const authRoutes = require('./routes/auth.router');
const userRoutes = require('./routes/user.router');
const toolRoutes = require('./routes/tool.router');
const locationRoutes = require('./routes/location.router');
const positionRoutes = require('./routes/position.router');
const unitRoutes = require('./routes/unit.router');
const companyRoutes = require('./routes/company.router');
const branchRoutes = require('./routes/branch.router');
const enterpriseRoutes = require('./routes/enterprise.router');
const departmentRoutes = require('./routes/department.router');
const channelRoutes = require('./routes/channel.router');
const vpnRoutes = require('./routes/vpn.router');
const ipaddressRoutes = require('./routes/ipaddress.router');
const requestRoutes = require('./routes/request.router');
const inspectorRoutes = require('./routes/inspector.router');
const notificationRoutes = require('./routes/notification.router');
const eventRoutes = require('./routes/event.router');
const statisticRoutes = require('./routes/statistic.router');
const loggerRoutes = require('./routes/logger.router');

const logger = require('./middleware/logger');
const apiError = require('./middleware/error');

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', '200.html'));
});

app.use(
  logger({ connectionString: MONGO_URI }).unless({
    path: [{ url: '/api/v1/logger', methods: ['GET', 'POST'] }]
  })
);

app.use(
  jwt({
    secret: JWT_SECRET_KEY,
    algorithms: ['sha1', 'RS256', 'HS256']
  }).unless({
    path: [
      { url: '/api/v1/auth/signin', methods: ['POST'] },
      { url: '/api/v1/auth/refresh', methods: ['POST'] },
      { url: '/api/v1/inspector', methods: ['POST', 'PUT'] }
      // { url: new RegExp('/api/v1/tool.*/', 'i'), methods: ['GET'] }
    ]
  })
);

app.use(express.static(path.join(__dirname, '..', 'client')));

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/tool', toolRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/position', positionRoutes);
app.use('/api/v1/unit', unitRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/branch', branchRoutes);
app.use('/api/v1/enterprise', enterpriseRoutes);
app.use('/api/v1/department', departmentRoutes);
app.use('/api/v1/channel', channelRoutes);
app.use('/api/v1/vpn', vpnRoutes);
app.use('/api/v1/ipaddress', ipaddressRoutes);
app.use('/api/v1/request', requestRoutes);
app.use('/api/v1/inspector', inspectorRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/statistic', statisticRoutes);
app.use('/api/v1/logger', loggerRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Oops! Error 404 has occurred' });
});

app.use((err, req, res, next) => {
  apiError(err, res);
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
