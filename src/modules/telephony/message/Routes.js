const { Router } = require('express');
const serviceHeader = require('../../utils/serviceHeader');
const { userCheckPerm } = require('../../permission/userCheckPerm');
const userCheckAuth = require('../../user/middlewares/userCheckAuth');
const pauseController = require('../../core/pauseController');
const sendSms = require('./controllers/sendSms');
const receiveSms = require('./controllers/receiveSms');
const messageSearch = require('./controllers/search');

const router = Router();

router.post(
  '/send-sms',
  serviceHeader('sendSms'),
  userCheckAuth,
  userCheckPerm('message.send.own'),
  sendSms,
);

router.post('/receive-sms', serviceHeader('sendSms'), receiveSms);

router.post(
  '/search',
  serviceHeader('messageSearch'),
  userCheckAuth,
  userCheckPerm('message.search.own'),
  pauseController,
  messageSearch,
);

module.exports = router;
