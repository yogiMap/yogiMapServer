const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');
const emailSearch = require('./controllers/search');
const emailDeleteById = require('./controllers/deleteById');
const pauseController = require('../core/pauseController');
const emailReadById = require('./controllers/readById');

const router = Router();

router.post('/search', serviceHeader('emailSearch'), emailSearch);

router.put('/:emailId', serviceHeader('emailDeleteById'), emailReadById);

router.delete(
  '/:emailId',
  serviceHeader('emailDeleteById'),
  userCheckPerm('email.delete.own'),
  pauseController,
  emailDeleteById,
);

module.exports = router;
