const TeacherAccount = require('../Model');
const message = require('../../utils/messages');

const teacherAccountStatsQuery = () => {
  return TeacherAccount.countDocuments()
    .then((docs) => {
      return message.success('Teacher Account stats found', docs);
    })
    .catch((error) => {
      return message.fail('Teacher Account stats error', error);
    });
};
module.exports = teacherAccountStatsQuery;
