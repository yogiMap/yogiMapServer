const message = require('../../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../../analytics/controllers/analytics');

const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const generateAccessToken = (req, res) => {
  const silent = get(process, 'env.CALL_SILENT', false);

  if (silent === 'false') {
    return res.status(200).json(message.success('Silent mode'));
  }

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  const accountSid = get(process, 'env.TWILIO_ACCOUNT_SID', ''); // Your Account SID from www.twilio.com/console
  const apiKey = get(process, 'env.TWILIO_API_KEY', ''); // Your Auth Token from www.twilio.com/console
  const apiSecret = get(process, 'env.TWILIO_API_SECRET', ''); // Your Auth Token from www.twilio.com/console

  const twimlAppSid = get(process, 'env.TWILIO_TWIML_APP_SID', ''); // Your Application SID from www.twilio.com/console/voice/twiml/apps

  if (!accountSid || !apiKey || !twimlAppSid) {
    const reason = 'Failed to get environment variables';
    //
    const analyticsId = analytics('CALL_GENERATE_ACCESS_TOKEN_FAIL', {
      reason,
      accountSidLength: accountSid.length,
      apiKeyLength: apiKey.length,
      twimlAppSidLength: twimlAppSid.length,
      controller: 'generateAccessToken',
      user: userId,
    });

    return res.status(400).json(message.fail(reason, analyticsId));
  }

  const accessToken = new AccessToken(accountSid, apiKey, apiSecret);
  const identity = userId;
  accessToken.identity = identity;

  const grant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  const token = accessToken.toJwt();
  console.log('token', token);

  return res.status(200).json(
    message.success('Generate access token. Success', {
      identity,
      token,
    }),
  );
};

module.exports = generateAccessToken;
