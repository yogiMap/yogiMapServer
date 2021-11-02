const StudentAccount = require('../Model');
const message = require('../../utils/messages');

const studentAccountUpdateByIdQuery = ({ studentAccountId, values }) => {
  return StudentAccount.updateOne(
    { _id: studentAccountId },
    { $set: values },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('StudentAccount updated');
      } else {
        return message.fail('StudentAccount not found');
      }
    })
    .catch((error) => {
      return message.fail('StudentAccount update error', error);
    });
};

module.exports = studentAccountUpdateByIdQuery;
