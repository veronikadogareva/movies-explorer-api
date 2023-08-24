const router = require('express').Router();
const rateLimit = require('express-rate-limit');

const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const {createUser, login} = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const {registerValidation, loginValidation} = require('../middlewares/validate');
//* * ограничитель запросов */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Слишком много запросов, пожалуйста попробуйте позже',
});
router.post('/signup', authLimiter, registerValidation, createUser);
router.post('/signin', authLimiter, loginValidation, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => {
    next(new NotFoundError('Страница не найдена'));
});
module.exports = router;