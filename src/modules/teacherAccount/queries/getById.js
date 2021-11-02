const TeacherAccount = require('../Model');
const message = require('../../utils/messages');

const teacherAccountGetByIdQuery = (teacherAccountId) => {
  return TeacherAccount.findById(teacherAccountId)

    .populate({
      path: 'classes',
      select: 'name date duration style classType description',
    })

    .populate({
      path: 'event',
      select: 'name date duration style classType description',
    })

    .populate({
      path: 'classType',
      select: 'name description',
    })

    .populate({
      path: 'style',
      select: 'name description',
    })

    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Teacher Account get by id OK', doc);
      } else {
        return message.fail('No Teacher Account for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Teacher Account by id ERROR', err);
    });
};

module.exports = teacherAccountGetByIdQuery;
