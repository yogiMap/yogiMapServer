const twilio = require('twilio');
const message = require('../../../utils/messages');
const { get } = require('lodash');

const sendSmsQuery = async ({ messageBody, to, sipPhoneObject }) => {
  const twilioAccountSid = get(sipPhoneObject, 'twilio.accountSid', '');
  const twilioAuthToken = get(sipPhoneObject, 'twilio.authToken', '');
  const twilioPhoneNumber = get(sipPhoneObject, 'phoneNumber', '');

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    return message.fail(
      'Must include twilioPhoneNumber and twilioAccountSid and twilioAuthToken',
    );
  }

  const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

  if (!messageBody || !to) {
    return message.fail('Must include body and phone number to send an sms');
  }

  return twilioClient.messages
    .create({
      body: messageBody,
      from: twilioPhoneNumber,
      to,
    })
    .then((response) => {
      return message.success('Twilio sms has been sent', response);
    })
    .catch((err) => {
      return message.fail('Twilio sms send error', err);
    });
};

module.exports = sendSmsQuery;
