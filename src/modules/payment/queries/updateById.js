const Payment = require('../Model');
const message = require('../../utils/messages');

const paymentUpdateByIdQuery = ({ paymentId, values }) => {
  return Payment.updateOne({ _id: paymentId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Payment updated');
      } else {
        return message.fail('Payment not found');
      }
    })
    .catch((err) => {
      return message.fail('Payment update error', err);
    });
};

module.exports = paymentUpdateByIdQuery;
