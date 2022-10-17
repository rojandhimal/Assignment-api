const router = require('express').Router();

const { apiGetAllPractitioners, apiGetPractitionerbyId, apiCreatePractitioner, apiUpdatePractitioner, apiDeletePractitioner } = require('../controller/Practitioner');

// routes
router.get('/', apiGetAllPractitioners);
router.get('/:id', apiGetPractitionerbyId);
router.post('/', apiCreatePractitioner);
router.put('/:id', apiUpdatePractitioner);
router.delete('/:id', apiDeletePractitioner);

module.exports = router;
