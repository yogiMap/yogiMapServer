const User = require('../userModel');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const userDeleteByEmail = (req, res) => {
  const userId = get(req, 'user._id');
  const deleteUser = get(req, 'params.email');

  User.deleteOne({ email: deleteUser })
    .exec()
    .then((doc) => {
      if (doc.n) {
        //
        analytics('USER_DELETE_SUCCESS', {
          deleteUser,
          user: userId,
        });

        res.status(200).json(message.success('User deleted'));
      } else {
        const reason = 'User not found';

        const analyticsId = analytics('USER_DELETE_FAIL', {
          reason: reason,
          deleteUser,
          user: userId,
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_DELETE_ERROR', {
        error,
        deleteUser,
        user: userId,
      });

      res.status(400).json(message.fail('User delete error', analyticsId));
    });
};

module.exports = userDeleteByEmail;
