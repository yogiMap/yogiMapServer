const { Router } = require('express');
const service = require('./serviceControllers');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const { userCheckPerm } = require('../permission/userCheckPerm');
const serviceHeader = require('../utils/serviceHeader');
const serviceControllersClient = require('./serviceControllersClient');
const serviceControllersUser = require('./serviceControllersUser');
const serviceControllersAddress = require('./serviceControllersAddress');

const router = Router();

router.get(
  '/',
  serviceHeader('service'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  service,
);

router.get(
  '/client',
  serviceHeader('service'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  serviceControllersClient,
);

router.get(
  '/user',
  serviceHeader('service'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  serviceControllersUser,
);

router.get(
  '/serviceAddress',
  serviceHeader('service'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  serviceControllersAddress,
);

module.exports = router;
