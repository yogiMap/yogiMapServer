const { Router } = require('express');
const serviceHeader = require('../../utils/serviceHeader');
const { userCheckPerm } = require('../../permission/userCheckPerm');
const userCheckAuth = require('../../user/middlewares/userCheckAuth');
const pauseController = require('../../core/pauseController');
const receiveCall = require('./controllers/receiveCall');
const messageSearch = require('./controllers/search');
const generateAccessToken = require('./controllers/generateAccessToken');
const outboundCallConnectToPhoneNumber = require('./controllers/outboundCallConnectToPhoneNumber');
const ingoingCallGenerateCapabilityToken = require('./controllers/inboundCallGenerateCapabilityToken');
const inboundCallConnectToPhoneNumber = require('./controllers/inboundCallConnectToPhoneNumber');
const statusCallback = require('./controllers/statusCallback');

const router = Router();

router.get(
  '/generateAccessToken',
  serviceHeader('generateAccessToken'),
  userCheckAuth,
  userCheckPerm('sipPhone.generate.token'),
  generateAccessToken,
);

router.post(
  '/statusCallback',
  serviceHeader('statusCallback'),
  // userCheckAuth,
  // userCheckPerm('sipPhone.generate.token'),
  statusCallback,
);

router.post('/connectPhone', outboundCallConnectToPhoneNumber); // webhook for Twilio
router.post('/connect/ingoing-call', inboundCallConnectToPhoneNumber); // webhook for Twilio

router.get(
  '/generate/ingoing-token',
  serviceHeader('ingoingCallGenerateCapabilityToken'),
  userCheckAuth,
  // userCheckPerm('telephony.call.generate.token'),
  ingoingCallGenerateCapabilityToken,
);

router.post('/receive-call', serviceHeader('receiveCall'), pauseController, receiveCall);

router.post(
  '/search',
  serviceHeader('messageSearch'),
  userCheckAuth,
  // userCheckPerm('message.search.own'),
  pauseController,
  messageSearch,
);

module.exports = router;
