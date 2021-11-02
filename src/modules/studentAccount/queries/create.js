const mongoose = require('mongoose');
const StudentAccount = require('../Model');
const message = require('../../utils/messages');

module.exports = function createStudentAccountQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const studentAccount = new StudentAccount({
    _id,
    ...values,
  });

  return studentAccount
    .save()
    .then(() => {
      return message.success('StudentAccount created', _id);
    })
    .catch((err) => {
      return message.fail('StudentAccount create error', err);
    });
};
