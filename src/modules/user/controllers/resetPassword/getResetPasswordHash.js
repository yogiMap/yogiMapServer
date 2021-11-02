const User = require('../../userModel');
const message = require('../../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../../analytics/controllers/analytics');

const getResetPasswordHash = (req, res) => {
  const userId = get(req, 'user._id');
  const hashUser = get(req, 'params.userId');

  User.findById(hashUser)
    .select('+resetPassword.hash')
    .exec()
    .then((doc) => {
      if (doc) {
        //
        analytics('USER_GET_HASH_SUCCESS', {
          user: userId,
          hashUser,
        });

        res
          .status(200)
          .json(message.success('User get hash. Success', doc.resetPassword));
      } else {
        const reason = 'No user for provided id';
        //
        const analyticsId = analytics('USER_GET_HASH_FAIL', {
          reason,
          user: userId,
          hashUser,
        });

        res.status(404).json(message.fail('No user for provided id', analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_GET_HASH_ERROR', {
        error,
        user: userId,
        hashUser,
      });

      res.status(400).json(message.fail('User get hash error', analyticsId));
    });
};

module.exports = getResetPasswordHash;
