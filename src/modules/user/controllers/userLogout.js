const { get } = require('lodash');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');

const userLogout = (req, res) => {
  const userId = get(req, 'user._id', '');

  req.session.destroy((error) => {
    if (!error) {
      // Expire cookie immediately => clear cookie
      res.cookie('connect.sid', '', { expires: new Date() });
      res.cookie('user_auth', '', {
        expires: new Date(),
        domain: process.env.NODE_ENV === 'local' ? 'localhost' : '.yogimap.com',
      });

      analytics('USER_LOGOUT_SUCCESS', {
        user: userId,
      });

      return res.status(200).json(
        message.success(
          'Logout success',
          {
            user: userId,
          },
          true,
        ),
      );
    } else {
      const analyticsId = analytics('USER_LOGOUT_ERROR', {
        error,
        controller: 'userLogout',
        req,
      });

      return res.status(400).json(message.fail('Logout failed', analyticsId, true));
    }
  });
};

module.exports = userLogout;
