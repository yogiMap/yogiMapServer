const StudentAccount = require('../Model');
const message = require('../../utils/messages');

const studentAccountGetByIdQuery = (studentAccountId) => {
  return StudentAccount.findById(studentAccountId)
    .populate({
      path: 'classes',
      select: name,
    })

    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('StudentAccount get by id OK', doc);
      } else {
        return message.fail('No StudentAccount for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get StudentAccount by id ERROR', err);
    });
};

module.exports = studentAccountGetByIdQuery;
