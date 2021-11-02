const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const fakeGeneratorBase = require('./base/fakeGeneratorBase');

const router = Router();

router.post(
  '/base',
  serviceHeader('fakeGeneratorBase'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  fakeGeneratorBase,
);

module.exports = router;
