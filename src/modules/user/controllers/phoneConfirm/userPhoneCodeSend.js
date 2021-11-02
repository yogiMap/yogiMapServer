const twilio = require('twilio');
const message = require('../../../utils/messages');
const analytics = require('../../../analytics/controllers/analytics');
const { get } = require('lodash');
const User = require('../../userModel');

const userPhoneCodeSend = async (req, res) => {
  const userId = get(req, 'user._id');

  const phone = get(req, 'body.phone', '');

  const isPhoneConfirmed = get(req, 'user.phoneConfirmation.confirmed', false);

  if (!isPhoneConfirmed) {
    const phoneConfirmation = await getPhoneConfirmationCode(userId, phone);

    if (phoneConfirmation.success) {
      const phoneConfirmationCode = phoneConfirmation.payload;

      const smsSent = await sendSmsWithConfirmationCode(phone, phoneConfirmationCode);

      if (smsSent.success) {
        res.status(200).json(smsSent);
      } else {
        res.status(400).json(smsSent);
      }
    } else {
      res.status(400).json(phoneConfirmation);
    }
  } else {
    const reason = 'Phone number already confirmed';
    //
    const analyticsId = analytics('USER_PHONE_CODE_SEND_FAIL', {
      reason,
      phone,
      userId,
    });

    res.status(400).json(message.fail('Send phone code. Fail', analyticsId));
  }
};

module.exports = userPhoneCodeSend;

function getPhoneConfirmationCode(userId, phone) {
  return User.findOneAndUpdate(
    { _id: userId },
    { $set: { phone: phone } },
    { runValidators: true },
  )
    .select('+phoneConfirmation.code')
    .exec()
    .then((user) => {
      if (user) {
        //
        analytics('USER_GET_PHONE_CONFIRMATION_CODE_SUCCESS', {
          user: userId,
          phone,
        });
        return message.success(
          'Save phone number in User and get phone confirmation code. Success',
          user.phoneConfirmation.code.toString(),
        );
      } else {
        const reason = 'User not found';
        //
        const analyticsId = analytics('USER_GET_PHONE_CONFIRMATION_CODE_FAIL', {
          reason,
          phone,
        });
        return message.fail(reason, analyticsId);
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_GET_PHONE_CONFIRMATION_CODE_ERROR', {
        error,
        phone,
        user: userId,
        controller: 'getPhoneConfirmationCode',
      });
      return message.fail(
        'Save phone number in User and get phone confirmation code. Error',
        analyticsId,
      );
    });
}

function sendSmsWithConfirmationCode(phone, phoneConfirmationCode) {
  if (process.env.NODE_ENV === 'stage' || process.env.SMS_SILENT === 'true') {
    return message.success('Silent mode');
  } else {
    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
    const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

    const client = new twilio(accountSid, authToken);

    return client.messages
      .create({
        to: `+${phone}`,
        from: process.env.TWILIO_PHONE_NUMBER, // Your valid Twilio number from www.twilio.com/console
        body: `From YogiMap: ${phoneConfirmationCode} is your phone verification code.`,
      })
      .then((sms) => {
        //
        analytics('USER_PHONE_CODE_SEND_SUCCESS', {
          smsId: sms.sid,
          phone,
        });
        return message.success('Send phone code. Success');
      })
      .catch((error) => {
        //
        const analyticsId = analytics('USER_PHONE_CODE_SEND_ERROR', {
          error,
          phone,
          controller: 'sendSmsWithConfirmationCode',
        });
        return message.fail('Send phone code. Error', analyticsId);
      });
  }
}
