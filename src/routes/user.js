const router = require('express').Router();

// USER MODULES
const { apiGetAllUsers, apiGetUserbyId, apiCreateUser, apiUpdatePassword, apiDeleteUser, apiUpdateUser } = require('../controller/userController');

// routes
router.get('/', apiGetAllUsers);
router.get('/:id', apiGetUserbyId);
router.post('/', apiCreateUser);
router.put('/:id', apiUpdateUser);
router.put('/update/password', apiUpdatePassword);
router.delete('/:id', apiDeleteUser);

module.exports = router;
