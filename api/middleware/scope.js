const User = require('../models/user.model');

module.exports = (allowScopes, options = {}) => {
  options.scopeKey = (options && options.scopeKey) || 'scope';

  if (typeof allowScopes === 'string') allowScopes = allowScopes.split(' ');
  if (!Array.isArray(allowScopes)) {
    throw new Error('Parameter allowScopes must be a string or an array of strings.');
  }

  return async (req, res, next) => {
    const error = (res) => {
      const err_message = 'You are not authorized to access this resource';
      if (options && options.errorToNext)
        return next({
          statusCode: 403,
          error: 'ScopedError',
          message: 'You are not authorized to access this resource'
        });
      res.append(
        'WWW-Authenticate',
        `Bearer scope="${allowScopes.join(' ')}", error="${err_message}"`
      );
      res.status(403).send(err_message);
    };

    if (allowScopes.length === 0) return next();
    if (!req.user) return error(res);
    if (!req.user.isActive) return error(res);
    if (req.user.isAdmin) return next();

    const { scope: userScopes } = await User.findById(req.user.id);

    // let userScopes = [];
    // const scopeKey = options.scopeKey;
    // if (typeof req.user[scopeKey] === 'string') {
    //   userScopes = req.user[scopeKey].split(' ');
    // } else if (Array.isArray(req.user[scopeKey])) {
    //   userScopes = req.user[scopeKey];
    // } else return error(res);

    let isAllowed;
    if (options && options.requireAll) {
      isAllowed = allowScopes.every((scope) => userScopes.includes(scope));
    } else {
      isAllowed = allowScopes.some((scope) => userScopes.includes(scope));
    }

    return isAllowed ? next() : error(res);
  };
};
