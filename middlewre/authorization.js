const jwt = require('jsonwebtoken');
const {
  SECRET_KEY, ERROR_UNAUTHORIZED,
} = require('../utils/constants');

module.exports.authorization = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    next(new Error(ERROR_UNAUTHORIZED));
  }
};
