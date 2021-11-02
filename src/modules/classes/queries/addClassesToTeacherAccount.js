const TeacherAccount = require('../../teacherAccount/Model');
const analytics = require('../../analytics/controllers/analytics');
const message = require('../../utils/messages');

module.exports = function addClassesToTeacherAccount({ classesId, teacherAccountId }) {
  return TeacherAccount.updateOne(
    { _id: teacherAccountId },
    { $addToSet: { classes: classesId } },
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
      analytics(CLASSES_ADD_TO_TEACHER_QUERY_ERROR, {
        teacherAccountId,
        classesId,
        controller: 'addClassesToTeacherAccount',
      });
      throw new Error(error);
    });
};
