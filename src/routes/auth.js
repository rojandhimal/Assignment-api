const router = require('express').Router();

// USER MODULES
const { apiRegisterUser, apiGetRefreshToken, apiLoginUser } = require('../controller/authController');

// route
router.post('/login', apiLoginUser);
router.post('/signup', apiRegisterUser);
router.get('/refresh-token', apiGetRefreshToken);

module.exports = router;