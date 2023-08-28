const router = require('express').Router();

const { validateNewMovie, validateId } = require('../middlewares/validate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateNewMovie, createMovie);
router.delete('/:id', validateId, deleteMovie);
module.exports = router;
