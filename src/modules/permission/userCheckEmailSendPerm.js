const message = require('../utils/messages');
const analytics = require('../analytics/controllers/analytics');
const { get } = require('lodash');

const userCheckEmailSendPerm = (req, res, next) => {
  const requestUserId = get(req, 'body.userId', '');
  const currentUserId = get(req, 'user._id', '').toString();
  const currentUserRoles = get(req, 'user.roles', []);

  if (currentUserId === requestUserId || currentUserRoles.includes('admin')) {
    next();
  } else {
    const analyticsId = analytics('USER_CHECK_EMAIL_SEND_PERM_FAIL', {
      body: req.body,
      user: currentUserId,
      currentUserRoles,
      permission: 'userCheckEmailSendPerm',
    });

    return res
      .status(400)
      .json(message.fail('User check email send permission. Fail', analyticsId));
  }
};

module.exports = userCheckEmailSendPerm;
