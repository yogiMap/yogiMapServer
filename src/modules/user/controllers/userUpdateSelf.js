const User = require('../userModel');
const message = require('../../utils/messages');
const { get, omitBy, isEmpty } = require('lodash');
const analytics = require('../../analytics/controllers/analytics');
const userProfileFieldsMapping = require('../helpers/userProfileFieldsMapping');

const userUpdateSelf = (req, res) => {
  const userId = get(req, 'user._id', '').toString();

  let user = userProfileFieldsMapping(req.body);

  user.personalAddress = omitBy(user.personalAddress, (a) => !a);
  user = omitBy(user, (a) => !a || isEmpty(a));

  const isEmailConfirmed = get(req, 'user.emailConfirmation.confirmed', false);
  const isPhoneConfirmed = get(req, 'user.phoneConfirmation.confirmed', false);

  // if confirmed do not update
  if (isEmailConfirmed) delete user.email;
  if (isPhoneConfirmed) delete user.phone;
  User.updateOne({ _id: userId }, { $set: user }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc) {
        analytics('USER_UPDATE_SELF_SUCCESS', {
          user: userId,
          body: req.body,
        });

        res.status(200).json(message.success('User updated'));
      } else {
        const reason = 'User not found';
        analytics('USER_UPDATE_SELF_FAIL', {
          reason,
          user: userId,
        });

        res.status(404).json(message.fail(reason));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_UPDATE_SELF_ERROR', {
        error,
        user: userId,
        body: req.body,
      });

      res.status(400).json(message.fail('User update error', analyticsId));
    });
};

module.exports = userUpdateSelf;
