const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { unauthorizedMessage } = require('../helpers/errorMessages');
const { SECRET_KEY } = require('../helpers/config');

module.exports = (req, res, next) => {
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
