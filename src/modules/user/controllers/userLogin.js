const { uniq, flattenDeep } = require('lodash');
const message = require('../../utils/messages');
const roles = require('../../permission/roles');
const analytics = require('../../analytics/controllers/analytics');
const userUpdateByIdQuery = require('../queries/updateById');
const passport = require('passport');
const acl = (userRoles) => uniq(flattenDeep(userRoles.map((el) => roles[el])));

const userLogin = (req, res, next) => {
  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) return next(err);

    if (user) {
      res.cookie('user_auth', true, {
        expires: new Date(253402300000000), // Expires in one month
        httpOnly: false, // can access from document.cookie  Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
        // secure: true, //Ensures the browser only sends the cookie over HTTPS. (почему то ломает, не записывает куки)
        // sameSite: 'none',
        domain: process.env.NODE_ENV === 'local' ? 'localhost' : '.yogimap.com', //indicates the domain of the cookie; use it to compare against the domain of the server in which the URL is being requested. If they match, then check the path attribute next.
      });

      // console.log('NODE_ENV', process.env.NODE_ENV);

      req.logIn(user, function (err) {
        if (err) return next(err);

        user.password = null;
        // Setting login date
        const loginDate = new Date();
        userUpdateByIdQuery({
          userId: user._id,
          values: { lastLogin: { date: loginDate } },
        });

        analytics('USER_LOGIN_SUCCESS', {
          user: user._id,
        });

        return res.status(200).json(
          message.success(
            'Login success',
            {
              user: user,
              acl: acl(user.roles),
              userId: user._id,
            },
            true,
          ),
        );
      });
    } else {
      const analyticsId = analytics('USER_LOGIN_FAIL', {
        reason: info.message,
      });

      res.status(400).json(message.fail(info.message, analyticsId));
    }
  })(req, res, next);
};
module.exports = userLogin;
