const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');

const userCheckAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const analyticsId = analytics('USER_CHECK_AUTH_ERROR', {
      controller: 'userCheckAuth',
      req,
    });

    return res.status(400).json(message.fail('Auth failed', analyticsId, true));
  }
};

module.exports = userCheckAuth;
