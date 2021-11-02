const TeacherAccount = require('../Model');
const message = require('../../utils/messages');

module.exports = function teacherAccountSearchQuery({ query, page, limit }) {
  return TeacherAccount.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))

    .populate({
      path: 'classes',
      select: 'name date duration style classType description',
    })

    .populate({
      path: 'event',
      select: 'name date style classType description',
    })

    .populate({
      path: 'classType',
      select: 'name description',
    })

    .populate({
      path: 'style',
      select: 'name description',
    })

    .populate({
      path: 'owner',
      select: 'name',
    })

    .exec()
    .then((docs) => {
      return message.success('Teacher Accounts found', docs);
    })
    .catch((error) => {
      return message.fail('Teacher Account search error', error);
    });
}
