const StudentAccount = require('../Model');
const message = require('../../utils/messages');

module.exports = function countStudentAccount(userId) {
  return StudentAccount.countDocuments({ owner: userId })
    .then((docs) => {
      return message.success('StudentAccount stats found', docs);
    })
    .catch((error) => {
      return message.fail('StudentAccount stats error', error);
    });
};
