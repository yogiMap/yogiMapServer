const message = require('../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../analytics/controllers/analytics');

const twilio = require('twilio');

const tollFreePhoneNumbers = (req, res) => {
  const accountSid = get(process, 'env.TWILIO_ACCOUNT_SID', ''); // Your Account SID from www.twilio.com/console
  const authToken = get(process, 'env.TWILIO_AUTH_TOKEN', '');

  console.log(accountSid, authToken);

  if (!accountSid || !authToken) {
    const reason = 'Failed to get environment variables';

    const analyticsId = analytics('AVAILABLE_TOLL_FREE_PHONE_NUMBER_FAIL', {
      reason,
      controller: 'tollFreePhoneNumbers',
      user: userId,
    });

    return res.status(400).json(message.fail(reason, analyticsId));
  }

  const client = twilio(accountSid, authToken);

  return client
    .availablePhoneNumbers('US')
    .tollFree.list({ contains: '866*******', limit: 10 })
    .then((result) => {
      return res
        .status(200)
        .json(message.success('Toll Free Phone Numbers. Success', result));
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(message.success('Toll Free Phone Numbers. Error', err));
    });
};

module.exports = tollFreePhoneNumbers;
