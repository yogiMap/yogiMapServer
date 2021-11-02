const Client = require('../Model');
const message = require('../../utils/messages');

const clientAddPaymentQuery = ({ clientId, paymentId }) => {
  return Client.updateOne(
    { _id: clientId },
    { $addToSet: { payments: paymentId } },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Client add payment is successful', doc);
      } else {
        return message.fail('Client add payment failed');
      }
    })
    .catch((error) => {
      return message.fail('Client add payment error', error);
    });
};

module.exports = clientAddPaymentQuery;
