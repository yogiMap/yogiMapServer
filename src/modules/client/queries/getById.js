const Message = require('../Model');
const message = require('../../utils/messages');

const clientGetByIdQuery = (clientId) => {
  return Message.findById(clientId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Client get by id OK', doc);
      } else {
        return message.fail('No Client for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Client by id ERROR', err);
    });
};

module.exports = clientGetByIdQuery;
