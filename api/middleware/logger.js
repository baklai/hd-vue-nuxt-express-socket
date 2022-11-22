const morgan = require('mongoose-morgan');
const { unless } = require('express-unless');

const DEV_LOG = ':method :status :url  :response-time ms - :res[content-length]';

const PROD_LOG =
  ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

const LOG = process.env.NODE_ENV === 'production' ? PROD_LOG : DEV_LOG;

morgan.token('remote-user', function (req, res) {
  return req.user ? `${req.user.login}` : 'anonymous';
});

module.exports = ({ connectionString }) => {
  const logger = morgan(
    { collection: 'logger', connectionString: connectionString },
    {
      skip: function (req, res) {
        return res.statusCode === 500;
      }
    },
    LOG
  );
  logger.unless = unless;
  return logger;
};
