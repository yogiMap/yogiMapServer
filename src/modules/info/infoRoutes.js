const { Router } = require('express');
const info = require('./infoControllers');
const serviceHeader = require('../utils/serviceHeader');

const router = Router();

router.get('/', serviceHeader('info'), info);

module.exports = router;
