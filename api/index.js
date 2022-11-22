const compression = require('compression');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');

const { MONGO_URI, BCRYPT_SALT, JWT_SECRET_KEY } = require('./config/api.config');

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
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/tool', toolRoutes);
app.use('/location', locationRoutes);
app.use('/position', positionRoutes);
app.use('/unit', unitRoutes);
app.use('/company', companyRoutes);
app.use('/branch', branchRoutes);
app.use('/enterprise', enterpriseRoutes);
app.use('/department', departmentRoutes);
app.use('/channel', channelRoutes);
app.use('/vpn', vpnRoutes);
app.use('/ipaddress', ipaddressRoutes);
app.use('/request', requestRoutes);
app.use('/inspector', inspectorRoutes);
app.use('/notification', notificationRoutes);
app.use('/event', eventRoutes);
app.use('/statistic', statisticRoutes);
app.use('/logger', loggerRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Oops! Error 404 has occurred' });
});

app.use((err, req, res, next) => {
  apiError(err, res);
});

console.info('API server success is running');

module.exports = app;
