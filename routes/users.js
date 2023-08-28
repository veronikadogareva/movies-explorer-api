const router = require('express').Router();

const { validateUpdateUser } = require('../middlewares/validate');
const { getUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', validateUpdateUser, updateUserInfo);
module.exports = router;
