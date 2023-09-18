const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { unauthorizedMessage } = require('../helpers/errorMessages');
const { SECRET_KEY } = require('../helpers/config');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   next(new UnauthorizedError('Ошибка авторизации'));
  // }
  // //* * извлекаем токен */
  // const token = authorization.replace('Bearer ', '');
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError(unauthorizedMessage));
  }
  req.user = payload;
  return next();
};
