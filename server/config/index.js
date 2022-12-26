const PORT = 3000;
const HOST = 'localhost';
const BCRYPT_SALT = 10;
const SOCKET_TIMEOUT = 60;

module.exports = {
  PORT: process.env.PORT || PORT,
  HOST: process.env.HOST || HOST,
  MONGO_URI: process.env.MONGO_URI,
  SOCKET_TIMEOUT: Number(process.env.SOCKET_TIMEOUT) || SOCKET_TIMEOUT,
  BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || BCRYPT_SALT
};
