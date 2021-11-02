const { get } = require('lodash');
const SipPhone = require('../../../sipPhone/Model');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

// This controller responds with TwiML instructions for connecting to the phone number.
// To do this, we use the webhook in the settings of our TwiML application (www.twilio.com/console/voice/twiml/apps).

const outboundCallConnectToPhoneNumber = async (req, res) => {
  let identity;
  const called = get(req, 'body.Called', '');
  if (called) {
    const sipPhone = await SipPhone.findOne({ phoneNumber: called });
    const ownerId = get(sipPhone, 'owner').toString();
    identity = ownerId;
  } else {
    identity = get(req, 'body.From');
  }

  const twilioNumber = get(process, 'env.TWILIO_PHONE_NUMBER', ''); // Your valid Twilio number from www.twilio.com/console

  const toNumberOrClientName = get(req, 'body.To');

  let twiml = new VoiceResponse();

  let dial;
  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == twilioNumber) {
    dial = twiml.dial();

    // This will connect the caller with your Twilio.Device/client
    dial.client(identity); // identity
  } else if (toNumberOrClientName) {
    // This is an outgoing call

    // set the callerId
    dial = twiml.dial({ callerId: twilioNumber, record: 'record-from-ringing' });

    twiml.gather();
    // Check if the 'To' parameter is a Phone Number or Client Name
    // in order to use the appropriate TwiML noun
    const attr = isAValidPhoneNumber(toNumberOrClientName) ? 'number' : 'client';
    dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say('Thanks for calling!');
  }

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
};

module.exports = outboundCallConnectToPhoneNumber;

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
