const router = require('express').Router();

// USER MODULES
const { apiGetAllRoles, apiGetRoleById, apiCreateRole, apiUpdateRoleById, apiDeleteRoleById } = require('../controller/roleController');

// route
router.get('/', apiGetAllRoles);
router.post('/', apiCreateRole);
router.get('/:id', apiGetRoleById);
router.put('/:id', apiUpdateRoleById);
router.delete('/:id',apiDeleteRoleById);

module.exports = router;