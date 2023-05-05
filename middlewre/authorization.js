const jwt = require('jsonwebtoken');
const {
  SECRET_KEY,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-errors');
const Unauthorized = require('../errors/unauthorized');

module.exports.authorization = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new NotFoundError('Нужно авторизоваться'));
  }
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    next(new Unauthorized('Неверные данные'));
  }
};
