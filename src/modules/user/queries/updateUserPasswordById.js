const User = require('../userModel');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');

const updateUserPasswordByIdQuery = ({ userId, encryptedNewPassword }) => {
  return User.updateOne(
    { _id: userId },
    {
      $set: {
        password: encryptedNewPassword,
        'resetPassword.hash': '',
        'resetPassword.date': Date.now(),
      },
      $push: { 'resetPassword.history': { date: new Date() } },
    },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('User password updated');
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_PASSWORD_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'User',
        user: userId,
        controller: 'updatePasswordById',
      });
      return message.fail('User password update error', analyticsId);
    });
};

module.exports = updateUserPasswordByIdQuery;
