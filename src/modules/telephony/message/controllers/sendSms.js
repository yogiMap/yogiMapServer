const { get } = require('lodash');
const message = require('../../../utils/messages');
const sendSmsQuery = require('../queries/sendSms');
const analytics = require('../../../analytics/controllers/analytics');
const messageCreateQuery = require('../queries/create');
const mongoose = require('mongoose');
const clientGetByIdQuery = require('../../../client/queries/getById');
const sipPhoneGetByOwnerIdQuery = require('../../../sipPhone/queries/getByOwnerId');

const sendSms = async (req, res) => {
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');

  const clientId = get(req, 'body.clientId');
  const _id = new mongoose.Types.ObjectId();
  const messageBody = get(req, 'body.messageBody', '');

  if (!clientId || !messageBody) {
    return res.status(400).json(message.fail('No client Id or message body'));
  }

  // Ищем клиента чтобы получить его основной номер
  const clientResult = await clientGetByIdQuery(clientId);
  if (clientResult.fail) {
    return res.status(400).json(message.fail('Client not found'));
  }

  const phoneNumber1 = get(clientResult, 'payload.phoneNumber1', {});

  const to = `+${phoneNumber1.code}${phoneNumber1.number}`;

  const sipPhoneGetByOwnerIdResult = await sipPhoneGetByOwnerIdQuery(userId);

  if (sipPhoneGetByOwnerIdResult.fail) {
    return res.status(400).json(message.fail('SIP phone not found'));
  }

  const sipPhoneObject = get(sipPhoneGetByOwnerIdResult, 'payload', {});

  const sendSmsQueryResult = await sendSmsQuery({ messageBody, to, sipPhoneObject });

  const { direction, from } = sendSmsQueryResult.payload;

  console.log(direction);

  const sms = {
    _id,
    client: clientId,
    owner: userId,
    messageBody,
    direction,
    from,
    to,
    teacherAccount: teacherAccountId,
  };

  const messageCreateQueryResult = await messageCreateQuery(sms);

  // const clientAddMessageQueryResult = await clientAddMessageQuery(clientId, _id);

  if (
    sendSmsQueryResult.success &&
    messageCreateQueryResult.success
    // &&  clientAddMessageQueryResult.success
  ) {
    res.status(200).json(message.success('Twilio sms has been sent', sendSmsQueryResult));
  } else {
    const analyticsId = analytics('TWILIO_SMS_SEND_ERROR', {
      error: messageCreateQueryResult.payload,
      body: req.body,
      entity: 'Message',
      // entityId: _id,
      user: userId,
      controller: 'sendSms',
    });

    res.status(400).json(message.fail(messageCreateQueryResult.message, analyticsId));
  }
};

module.exports = sendSms;
