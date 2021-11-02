const message = require('../utils/messages');
const { get } = require('lodash');

const userHasTeacherAccount = (req, res, next) => {
  const teacherAccountId = get(req, 'user.teacherAccount', '');
  if (teacherAccountId) next();
  else res.status(400).json(message.fail('No teacherAccountId'));
};

module.exports = userHasTeacherAccount;
