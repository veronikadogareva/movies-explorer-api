const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ProhibitionError = require('../errors/ProhibitionError');

const getMovies = (req, res, next) => {
    Movie.find({})
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
        owner: owner
    };
    Movie.create(movieParams)
        .then((movie) => {
            res.status(201).send(movie);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Неверный запрос. Пожалуйста, проверьте введенные данные и повторите запрос.'));
            } else {
                next(err);
            }
        });
};

const deleteMovie = (req, res, next) => {
    Movie.findByIdAndRemove(req.params.id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм с указанным идентификатором не найден.'));
      }
      if (req.user._id === movie.owner.toString()) {
        return res.send(movie);
      }
      return next(new ProhibitionError('Вы можете удалять только свои фильмы.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверный запрос. Пожалуйста, проверьте введенные данные и повторите запрос.'));
      }
      return next(err);
    });
}
module.exports = {
    getMovies,
    createMovie,
    deleteMovie
}