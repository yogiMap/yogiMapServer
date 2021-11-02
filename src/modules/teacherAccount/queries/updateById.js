const TeacherAccount = require('../Model');
const message = require('../../utils/messages');

const teacherAccountUpdateByIdQuery = ({ teacherAccountId, values }) => {
  return TeacherAccount.updateOne(
    { _id: teacherAccountId },
    { $set: values },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Teacher Account updated');
      } else {
        return message.fail('Teacher Account not found');
      }
    })
    .catch((error) => {
      return message.fail('Teacher Account update error', error);
    });
};

module.exports = teacherAccountUpdateByIdQuery;
