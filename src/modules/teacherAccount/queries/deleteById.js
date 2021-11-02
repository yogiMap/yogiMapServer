const TeacherAccount = require('../Model');
const message = require('../../utils/messages');

module.exports = function deleteTeacherAccountByIdQuery(teacherAccountId) {
  return TeacherAccount.deleteOne({ _id: teacherAccountId })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('TeacherAccount deleted', teacherAccountId);
      } else {
        return message.fail('TeacherAccount not found', teacherAccountId);
      }
    })
    .catch((error) => {
      return message.fail('TeacherAccount delete error', error);
    });
};
