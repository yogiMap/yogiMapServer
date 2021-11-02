const User = require('../../userModel');
const message = require('../../../utils/messages');
const analytics = require('../../../analytics/controllers/analytics');
const { get } = require('lodash');

const userPhoneCodeCheck = (req, res) => {
  const userId = get(req, 'user._id');
  const code = get(req, 'body.code', '');

  User.findById(userId)
    .select('phoneConfirmation.code')
    .exec()
    .then((user) => {
      if (user) {
        if (user.phoneConfirmation.code === code) {
          user.phoneConfirmation.confirmed = true;

          user
            .save()
            .then(() => {
              //
              analytics('USER_PHONE_CODE_CHECK_SUCCESS', {
                user: userId,
                code,
              });

              res
                .status(200)
                .json(message.success('Phone number confirmed successfully'));
            })
            .catch((error) => {
              //
              const analyticsId = analytics('USER_PHONE_CODE_CHECK_ERROR', {
                error: error.message, // just error is too big to write to the DB and analytics will not be written to the DB
                user: userId,
                code,
                controller: 'userPhoneCodeCheck',
              });

              res
                .status(400)
                .json(message.fail('Phone number confirmation. Error', analyticsId));
            });
        } else {
          const reason = 'Invalid code';
          //
          const analyticsId = analytics('USER_PHONE_CODE_CHECK_FAIL', {
            reason,
            user: userId,
            code,
            req,
          });

          res
            .status(400)
            .json(message.fail('Phone number confirmation. Fail', analyticsId));
        }
      } else {
        const reason = 'Phone number confirmation. Fail. User not found';
        //
        const analyticsId = analytics('USER_PHONE_CODE_CHECK_FAIL', {
          reason,
          user: userId,
          code,
          req,
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_PHONE_CODE_CHECK_ERROR', {
        error,
        req,
        code,
        controller: 'userPhoneCodeCheck',
      });

      res.status(400).json(message.fail('Phone number confirmation. Error', analyticsId));
    });
};

module.exports = userPhoneCodeCheck;
