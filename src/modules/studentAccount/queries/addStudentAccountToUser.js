const User = require('../../user/userModel');
const analytics = require('../../analytics/controllers/analytics');
const message = require('../../utils/messages');

module.exports = function addStudentAccountToUser({ studentAccountId, userId }) {
  return User.updateOne(
    { _id: userId },
    { $addToSet: { studentAccount: studentAccountId } },
    { runvalidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('StudentAccount is not updated');
      }
    })
    .catch((error) => {
      analytics(StudentAccount_ADD_TO_USER_QUERY_ERROR, {
        userId,
        studentAccountId,
        controller: 'addStudentAccountToUser',
      });
      throw new Error(error);
    });
};
