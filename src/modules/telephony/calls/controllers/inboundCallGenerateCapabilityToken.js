const twilio = require('twilio');
const message = require('../../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../../analytics/controllers/analytics');

const callGenerateCapabilityToken = (req, res) => {
  const silent = get(process, 'env.CALL_SILENT', false);

  if (silent === 'true') {
    return res.status(200).json(message.success('Silent mode'));
  }

  const userId = get(req, 'user._id', null);
  const accountSid = get(process, 'env.TWILIO_ACCOUNT_SID', ''); // Your Account SID from www.twilio.com/console
  const authToken = get(process, 'env.TWILIO_AUTH_TOKEN', ''); // Your Auth Token from www.twilio.com/console
  const applicationSid = get(process, 'env.TWILIO_TWIML_APP_SID', ''); // Your Application SID from www.twilio.com/console/voice/twiml/apps

  if (!accountSid || !authToken || !applicationSid) {
    const reason = 'Failed to get environment variables';
    //
    const analyticsId = analytics('CALL_GENERATE_CAPABILITY_TOKEN_FAIL', {
      reason,
      accountSidLength: accountSid.length,
      authTokenLength: authToken.length,
      applicationSidLength: applicationSid.length,
      controller: 'callGenerateCapabilityToken',
      user: userId,
    });
    return res.status(400).json(message.fail(reason, analyticsId));
  }

  const ClientCapability = twilio.jwt.ClientCapability;
  const capability = new ClientCapability({ accountSid, authToken });

  // Create a token for initiating outgoing connections.
  // capability.addScope(new ClientCapability.IncomingClientScope('11111111111111111111'));
  capability.addScope(new ClientCapability.IncomingClientScope(`${userId}`));

  const token = capability.toJwt();

  return res
    .status(200)
    .json(message.success('Generate capability token. Success', token));
};

module.exports = callGenerateCapabilityToken;
