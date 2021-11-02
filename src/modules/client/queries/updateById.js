const Client = require('../Model');
const message = require('../../utils/messages');

const clientUpdateByIdQuery = ({ clientId, values }) => {
  return Client.updateOne({ _id: clientId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Client updated');
      } else {
        return message.fail('Client not found');
      }
    })
    .catch((error) => {
      return message.fail('Client update error', error);
    });
};

module.exports = clientUpdateByIdQuery;
