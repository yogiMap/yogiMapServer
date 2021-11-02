const TeacherAccount = require('../Model');
const message = require('../../utils/messages');

module.exports = function countTeachers(userId) {
  return TeacherAccount.countDocuments({ owner: userId })
    .then((docs) => {
      return message.success('Teacher Account stats found', docs);
    })
    .catch((error) => {
      return message.fail('Teacher Account stats error', error);
    });
};
