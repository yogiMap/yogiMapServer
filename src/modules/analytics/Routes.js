const { Router } = require('express');

const getById = require('./controllers/getById');
const serviceHeader = require('../utils/serviceHeader');

const router = Router();

router.get('/:analyticsId', serviceHeader('analyticsGetById'), getById);

module.exports = router;
