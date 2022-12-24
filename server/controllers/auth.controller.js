const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const { toResponse, toToken } = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');

const {
  JWT_SECRET_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} = require('../config/api.config');

const signin = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login });
    if (!user) return res.status(404).json({ message: 'User is not found' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is disabled' });
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.status(403).json({ message: 'The password is incorrect' });
    const accessToken = jwt.sign(toToken(user), JWT_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
    const userRefreshToken = await RefreshToken.findOne({ user: user._id });
    if (userRefreshToken) await userRefreshToken.deleteOne();
    await RefreshToken.create({ user: user.id, token: refreshToken });
    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const signout = async (req, res, next) => {
  try {
    await RefreshToken.deleteOne({ user: req.user.id });
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken === null)
      return res.status(403).json({ message: 'Refresh token is required' });
    const userRefreshToken = await RefreshToken.findOne({ token: refreshToken });
    if (!userRefreshToken)
      return res.status(403).json({ message: 'Refresh token is not in database' });
    const valid = jwt.verify(refreshToken, JWT_SECRET_KEY);
    if (!valid)
      return res
        .status(403)
        .json({ message: 'Refresh token was expired. Please make a new signin request' });
    const user = await User.findById(userRefreshToken.user);
    const accessToken = jwt.sign(toToken(user), JWT_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user: toResponse(user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { signin, signout, refresh, me };
