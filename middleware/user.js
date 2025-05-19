const authUtil = require('../utils/authUtil');

const userMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    const user = authUtil.validateAuthToken(token);
    if (user) {
      req.user = user;
      res.locals.user = user; // Make user available to all views
    } else {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = userMiddleware;