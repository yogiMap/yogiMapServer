const TeacherAccount = require('../Model');
const analytics = require('../../analytics/controllers/analytics');
const message = require('../../utils/messages');

module.exports = function addStyleToTeacherAccount({ styleId, teacherAccountId }) {
  return TeacherAccount.updateOne(
    { _id: teacherAccountId },
    { $addToSet: { style: styleId } },
    { runvalidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('Style is not updated');
      }
    })
    .catch((error) => {
      analytics(STYLE_ADD_TO_TEACHERACCOUNT_QUERY_ERROR, {
        teacherAccountId,
        styleId,
        controller: 'addStyleToTeacherAccount',
      });
      throw new Error(error);
    });
};
