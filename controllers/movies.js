const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ProhibitionError = require('../errors/ProhibitionError');
const { badRequestMessage, movieNotFoundMessage, limitedDeletionMessage } = require('../helpers/errorMessages');
const { CREATED } = require('../helpers/statuses');

const getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const params = req.body;
  const owner = req.user._id;
  const movieParams = {
    ...params,
    owner,
  };
  Movie.create(movieParams)
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(movieNotFoundMessage));
      }
      if (req.user._id === movie.owner.toString()) {
        return movie.deleteOne();
      }
      throw new ProhibitionError(limitedDeletionMessage);
    })
    .then((removedMovie) => res.send(removedMovie))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestMessage));
      }
      return next(err);
    });
};
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
