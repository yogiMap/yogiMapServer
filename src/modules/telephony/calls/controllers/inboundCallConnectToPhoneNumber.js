const twilio = require('twilio');
const { get } = require('lodash');
// const analytics from '../../../analytics/controllers/analytics');

// This controller responds with TwiML instructions for connecting to the phone number.
// To do this, we use the webhook in the settings of our TwiML application (www.twilio.com/console/voice/twiml/apps).
const VoiceResponse = twilio.twiml.VoiceResponse;

const inboundCallConnectToPhoneNumber = (req, res) => {
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');
  const clientId = get(req, 'body.client');

  console.log(' == userId INBOUND ==: ', userId);
  console.log(' == teacherAccountId INBOUND ==: ', teacherAccountId);
  console.log(' == clientId INBOUND ==: ', clientId);

  const deviceIdentity = '11111111111111111111'; //HARDCODED
  // const deviceIdentity = userId; //HARDCODED

  const { body } = req;
  console.log('bodyyyy', body);
  console.log('HERE');

  const voiceResponse = new VoiceResponse();
  const dial = voiceResponse.dial({
    timeout: 20,
  });
  dial.client(
    {
      statusCallbackEvent: 'initiated ringing answered completed',
      // statusCallback: `${config.get('twilio.callbackURL')}/api/v1/communication/callInboundStatusCallBack`,
      statusCallbackMethod: 'POST',
    },
    deviceIdentity,
  );
  const voiceResponseString = voiceResponse.toString();
  res.type('text/xml');
  res.send(voiceResponseString.toString());

  // const phoneNumber = get(req, 'body.phoneNumber', '');
  // const userId = get(req, 'body.userId', '');
  // const twilioNumber = get(process, 'env.TWILIO_PHONE_NUMBER', ''); // Your valid Twilio number from www.twilio.com/console
  // const VoiceResponse = twilio.twiml.VoiceResponse;
  // const response = new VoiceResponse();
  //
  // console.log('body', req.body);
  // console.log('phoneNumber', phoneNumber);
  //
  // const dial = response.dial({
  //   callerId: twilioNumber,
  //   record: true,
  //   timeout: 10,
  // });
  // dial.client({statusCallbackEvent: 'initiated ringing answered completed'}, `${userId}`);
  // res
  //   .writeHead(200, {
  //     'Content-Type': 'text/xml',
  //   })
  //   .end(response.toString()); // response to Twilio

  // if (!twilioNumber) {
  //   const reason = 'Failed to get environment variable');
  //   //
  //   analytics('CALL_CONNECT_TO_PHONE_NUMBER_FAIL', {
  //     reason,
  //     twilioNumber,
  //     controller: 'callConnectToPhoneNumber',
  //   });
  //
  //   res
  //     .writeHead(400, {
  //       'Content-Type': 'text/xml',
  //     })
  //     .end(); // response to Twilio
  // }
};

module.exports = inboundCallConnectToPhoneNumber;
