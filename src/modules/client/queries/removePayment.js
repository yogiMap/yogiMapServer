const Client = require('../Model');
const message = require('../../utils/messages');

const clientRemovePaymentQuery = ({ clientId, paymentId }) => {
  return Client.updateOne(
    { _id: clientId },
    { $pull: { payments: { $in: [paymentId] } } },
    { multi: false, runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('Client remove payment is not updated');
      }
    })
    .catch((error) => {
      return message.fail('Client remove payment error', error);
    });
};

module.exports = clientRemovePaymentQuery;
