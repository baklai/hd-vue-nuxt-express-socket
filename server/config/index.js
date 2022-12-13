const BCRYPT_SALT = 10;
const TOKEN_EXPIRES_IN = '24h';
const JWT_SECRET_KEY = 'HELPDESK_JWT_SECRET_KEY';

module.exports = {
  PORT: process.env.PORT || process.env.NODE_ENV === 'production' ? 80 : 3000,
  HOST: process.env.HOST || process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  MONGO_URI: process.env.MONGO_URI,
  BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || BCRYPT_SALT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || JWT_SECRET_KEY,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || TOKEN_EXPIRES_IN
};
