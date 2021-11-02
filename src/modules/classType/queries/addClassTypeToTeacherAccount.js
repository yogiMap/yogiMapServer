const TeacherAccount = require('../Model');
const analytics = require('../../analytics/controllers/analytics');
const message = require('../../utils/messages');

module.exports = function addClassTypeToTeacherAccount({
  classTypeId,
  teacherAccountId,
}) {
  return TeacherAccount.updateOne(
    { _id: teacherAccountId },
    { $addToSet: { classType: classTypeId } },
    { runvalidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('TeacherAccount is not updated');
      }
    })
    .catch((error) => {
      analytics(ClassType_ADD_TO_TEACHERACCOUNT_QUERY_ERROR, {
        teacherAccountId,
        classTypeId,
        controller: 'addClassTypeToTeacherAccount',
      });
      throw new Error(error);
    });
};
