const router = require('express').Router();

const authLimiter = require('../helpers/rate-limiter');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const {createUser, login} = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const {registerValidation, loginValidation} = require('../middlewares/validate');
router.post('/signup', authLimiter, registerValidation, createUser);
router.post('/signin', authLimiter, loginValidation, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => {
    next(new NotFoundError('Страница не найдена'));
});
module.exports = router;