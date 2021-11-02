const message = require('../../utils/messages');
const User = require('../../user/userModel');
const { get } = require('lodash');

module.exports = async function addStudentAccountRole(userId) {
  let currentRoles = [];
  console.log(userId, 'userId');
  await User.findById(userId)
    .exec()
    .then((user) => {
      if (user) {
        // Receiving data to send a notification
        currentRoles = get(user, 'roles', []);
      }
    })
    .catch((error) => {
      return message.fail('studentAccount role update error', error);
    });

  const isUserWithRoleVerified = currentRoles.length >= 1 && currentRoles[0] !== 'new';
  const newRoles = 'student';

  if (isUserWithRoleVerified) {
    return User.updateOne(
      { _id: userId },
      { $addToSet: { roles: newRoles } },
      { runValidators: true },
    )
      .exec()
      .then((doc) => {
        if (doc.n) {
          return message.success('StudentAccount role updated');
        } else {
          return message.fail('StudentAccount role not updated');
        }
      })
      .catch((error) => {
        return message.fail('StudentAccount role update error', error);
      });
  }
};
