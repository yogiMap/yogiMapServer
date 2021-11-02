const Client = require('../Model');
const message = require('../../utils/messages');

// TODO Изменить на увеличение счетчика непрочитанных сообщений

const clientAddMessageQuery = (clientId, messageId) => {
  return Client.updateOne(
    { _id: clientId },
    { $addToSet: { messages: messageId } },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('Client add message is not updated');
      }
    })
    .catch((error) => {
      return message.fail('Client add message error', error);
    });
};

module.exports = clientAddMessageQuery;
