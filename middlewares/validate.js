const { celebrate, Joi } = require('celebrate');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

const linkRegex = /^(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?[a-zA-Z0-9_-]{11}|https?:\/\/[a-zA-Z0-9_.\/-]+)$/;

const registerValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email().pattern(emailRegex),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().pattern(emailRegex),
    password: Joi.string().required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email().pattern(emailRegex),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().min(2).max(50).required(),
    nameEN: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    director: Joi.string().min(2).max(50).required(),
    year: Joi.string().min(2).max(4).required(),
    description: Joi.string().min(2).required(),
    duration: Joi.number().required(),
    image: Joi.string().required().pattern(linkRegex),
    trailerLink: Joi.string().required().pattern(linkRegex),
    thumbnail: Joi.string().required().pattern(linkRegex),
    movieId: Joi.number().required(),

  }),
});

module.exports = {
  registerValidation,
  loginValidation,
  validateUpdateUser,
  validateNewMovie,
  validateId,
};
