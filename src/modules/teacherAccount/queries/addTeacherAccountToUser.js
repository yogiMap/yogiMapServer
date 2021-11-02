const User = require('../../user/userModel');
const analytics = require('../../analytics/controllers/analytics');
const message = require('../../utils/messages');

module.exports = function addTeacherAccountsToUser({ teacherAccountId, userId }) {
  return User.updateOne(
    { _id: userId },
    { $addToSet: { teacherAccount: teacherAccountId } },
    { runvalidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('User is not updated');
      }
    })
    .catch((error) => {
      analytics(USERACCOUNT_ADD_TO_USER_QUERY_ERROR, {
        userId,
        teacherAccountId,
        controller: 'addTeacherAccountsToUser',
      });
      throw new Error(error);
    });
};
