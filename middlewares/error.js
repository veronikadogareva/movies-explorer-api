const { serverErrorMessage } = require('../helpers/errorMessages');

module.exports = (err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = statusCode === 500 ? serverErrorMessage : err.message;
  res.status(statusCode).send({
    message,
  });
  next();
};
