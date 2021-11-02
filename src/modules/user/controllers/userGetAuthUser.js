const { get, uniq, flattenDeep } = require('lodash');
const message = require('../../utils/messages');
const { roles } = require('../../permission/roles');
const analytics = require('../../analytics/controllers/analytics');

const acl = (userRoles) => uniq(flattenDeep(userRoles.map((el) => roles[el])));

const userGetAuthUser = (req, res) => {
  const user = get(req, 'user', {});
  if (user) {
    res.cookie('user_auth', true, {
      // sameSite: 'None',
      secure: true,
      expires: new Date(253402300000000), // Expires in one month
      httpOnly: false, // can access from document.cookie
    });

    analytics('USER_GET_AUTH_USER_SUCCESS', { user });

    res.status(200).json(
      message.success(
        'Auth ok',
        {
          acl: acl(user.roles),
          user,
        },
        true,
      ),
    );
  } else {
    const reason = 'No user for provided id';
    const analyticsId = analytics('USER_GET_AUTH_USER_FAIL', {
      reason,
    });

    res.status(404).json(message.fail(reason, analyticsId));
  }
};

module.exports = userGetAuthUser;
