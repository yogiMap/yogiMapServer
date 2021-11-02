const mongoose = require('mongoose');
const TeacherAccount = require('../Model');
const message = require('../../utils/messages');

module.exports = async function createTeacherAccountQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const teacherAccount = new TeacherAccount({
    _id,
    ...values,
  });

  return teacherAccount
    .save()
    .then(() => {
      return message.success('TeacherAccount created', _id);
    })
    .catch((error) => {
      return message.fail('TeacherAccount create error', error);
    });
};
