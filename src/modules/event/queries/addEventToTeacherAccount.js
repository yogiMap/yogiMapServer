const TeacherAccount = require('../../teacherAccount/Model');
const analytics = require('../../analytics/controllers/analytics');
const message = require('../../utils/messages');

module.exports = function addEventToTeacherAccount({ eventId, teacherAccountId }) {
  return TeacherAccount.updateOne(
    { _id: teacherAccountId },
    { $addToSet: { event: eventId } },
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
      analytics(EVENT_ADD_TO_TEACHERACCOUNT_QUERY_ERROR, {
        teacherAccountId,
        eventId,
        controller: 'addEventToTeacherAccount',
      });
      throw new Error(error);
    });
};
