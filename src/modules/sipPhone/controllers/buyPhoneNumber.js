const message = require('../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../analytics/controllers/analytics');

const twilio = require('twilio');
const createSipPhoneQuery = require('../queries/create');
const mongoose = require('mongoose');

module.exports = async function buyPhoneNumber(req, res) {
  // Получаем id текущего пользователя
  const _id = new mongoose.Types.ObjectId();
  const userId = get(req, 'user._id');
  const phoneNumber = get(req, 'body.phoneNumber', '');
  const teacherAccountId = get(req, 'user.teacherAccount');
  const description = 'description';

  const accountSid = get(process, 'env.TWILIO_ACCOUNT_SID', ''); // Your Account SID from www.twilio.com/console
  const authToken = get(process, 'env.TWILIO_AUTH_TOKEN', '');

  console.log(accountSid, authToken);

  if (!accountSid || !authToken || !phoneNumber) {
    const reason = 'Failed to get environment variables';
    const analyticsId = analytics('AVAILABLE_PHONE_NUMBER_FAIL', {
      reason,
      controller: 'availablePhoneNumbers',
      user: userId
    });
    return res.status(400).json(message.fail(reason, analyticsId));
  }

  const client = twilio(accountSid, authToken);
  let createSipPhoneQueryResult;

  client.incomingPhoneNumbers
    .create({
      phoneNumber: phoneNumber,//'+15005550001',
      // voiceUrl: 'http://demo.twilio.com/docs/voice.xml',
      voiceApplicationSid: 'AP396e8c951191ddf94fdb1dee24e95265', // Twilio APP sid
      smsApplicationSid: 'AP396e8c951191ddf94fdb1dee24e95265'
    })
    .then((incoming_phone_number) => {
      console.log(incoming_phone_number);
      createSipPhoneQueryResult = createSipPhoneQuery({
        _id,
        phoneNumber,
        description,
        owner: userId,
        teacherAccount: teacherAccountId,
        twilio: {
          accountSid: process.env.TWILIO_ACCOUNT_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN
        }
      })
      return createSipPhoneQueryResult
    }).then((createSipPhoneQueryResult)=>{
    if ( createSipPhoneQueryResult.success) {
      console.log(createSipPhoneQueryResult);
      res.status(200).json(createSipPhoneQueryResult);
    } else {
      const analyticsId = analytics('SIP_PHONE_CREATE_ERROR', {
        error: createSipPhoneQueryResult.payload,
        body: req.body,
        entity: 'SipPhone',
        entityId: _id,
        user: userId,
        controller: 'sipPhoneCreate'
      });
      res.status(400).json(message.fail('SipPhone create error', analyticsId));
    }
  })
    .catch((err) => {
      res.status(400).json(message.fail('Twilio was nor able to create a number', err));
    });
};

