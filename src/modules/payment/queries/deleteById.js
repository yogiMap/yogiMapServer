const Payment = require('../Model');
const message = require('../../utils/messages');
const paymentDeleteByIdQuery = (paymentId) => {
  return Payment.deleteOne({ _id: paymentId })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Payment deleted');
      } else {
        return message.fail('Payment not found');
      }
    })
    .catch((error) => {
      return message.fail('Payment delete error', error);
    });
};
module.exports = paymentDeleteByIdQuery;
