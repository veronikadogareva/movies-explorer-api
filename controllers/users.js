const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { SECRET_KEY } = require('../helpers/config');
const {
  userNotFoundMessage, badRequestMessage, emailTakenMessage, invalidCredentialsMessage,
} = require('../helpers/errorMessages');
const { DONE, CREATED } = require('../helpers/statuses');

// const { NODE_ENV, JWT_SECRET } = process.env;
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(userNotFoundMessage));
      } else {
        res.status(DONE).send(user);
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(userNotFoundMessage));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else if (err.code === 11000) {
        next(new ConflictError(emailTakenMessage));
      } else {
        next(err);
      }
    });
};
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then(() => {
      res.status(CREATED).send({
        email: req.body.email,
        name: req.body.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else if (err.code === 11000) {
        next(new ConflictError(emailTakenMessage));
      } else {
        next(err);
      }
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  let dataBaseUser;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError(invalidCredentialsMessage);
      dataBaseUser = user;
      return bcrypt.compare(password, dataBaseUser.password);
    })
    .then((isValidPassword) => {
      if (!isValidPassword) throw new UnauthorizedError(invalidCredentialsMessage);
      const token = jwt.sign({ _id: dataBaseUser._id }, SECRET_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};
module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
};
