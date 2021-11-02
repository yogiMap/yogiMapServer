const mongoose = require('mongoose');
//const SipPhone = require ( '../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createSipPhoneQuery = require('../queries/create');

module.exports = async function sipPhoneCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');
  const ownerId = get(req, 'body.owner');

  const teacherAccountId = get(req, 'user.teacherAccount');

  // Читаем данные из запроса
  const phoneNumber = get(req, 'body.phoneNumber');
  const description = get(req, 'body.description');

  const createSipPhoneQueryResult = await createSipPhoneQuery({
    _id,
    phoneNumber,
    description,
    owner: ownerId,
    teacherAccount: teacherAccountId,
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    },
  });

  if (createSipPhoneQueryResult.success) {
    res.status(200).json(createSipPhoneQueryResult);
  } else {
    const analyticsId = analytics('SIP_PHONE_CREATE_ERROR', {
      error: createSipPhoneQueryResult.payload,
      body: req.body,
      entity: 'SipPhone',
      entityId: _id,
      user: userId,
      controller: 'sipPhoneCreate',
    });

    res.status(400).json(message.fail('SipPhone create error', analyticsId));
  }
};
