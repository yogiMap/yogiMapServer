const message = require('../utils/messages');
const { roles } = require('./roles');
const analytics = require('../analytics/controllers/analytics');
const { get } = require('lodash');

const userCan = (userRoles, checkedPermission) => {
  for (let i = 0; i < userRoles.length; i++) {
    if (roles[userRoles[i]].includes(checkedPermission)) return true;
  }
  return false;
};

const userCheckPerm = (checkedPermission) => (req, res, next) => {
  const user = get(req, 'user', {});
  if (user) {
    const roles = get(user, 'roles', []);

    if (userCan(roles, checkedPermission)) {
      next();
    } else {
      const reason = 'Permission denied';
      const analyticsId = analytics('USER_CHECK_PERMISSION_FAIL', {
        reason,
        roles,
        user: user._id,
      });

      res.status(400).json(message.fail(reason, analyticsId));
    }
  } else {
    const reason = 'User not found';
    const analyticsId = analytics('USER_CHECK_PERMISSION_FAIL', {
      reason,
      permission: 'userCheckPerm',
    });

    res.status(400).json(message.fail(reason, analyticsId, true));
  }
};

module.exports = { userCheckPerm, userCan };
