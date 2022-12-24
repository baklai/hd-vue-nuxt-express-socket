const BCRYPT_SALT = 10;

module.exports = {
  PORT: process.env.PORT || process.env.NODE_ENV === 'production' ? 80 : 3001,
  HOST: process.env.HOST || process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  MONGO_URI: process.env.MONGO_URI,
  BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || BCRYPT_SALT
};
