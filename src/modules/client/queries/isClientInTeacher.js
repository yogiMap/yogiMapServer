const Client = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');

const isClientInTeacher = (clientId, teacherAccountId) => {
  return Client.findById(clientId)
    .exec()
    .then((doc) => {
      if (doc) {
        const teacherAccount = get(doc, 'teacherAccount');

        if (String(teacherAccount) === String(teacherAccountId)) {
          return message.success('Client check ok');
        } else {
          return message.fail('Client is not on current Teacher Account');
        }
      }
    })
    .catch((err) => {
      return message.fail('Get Client by id ERROR', err);
    });
};

module.exports = isClientInTeacher;
