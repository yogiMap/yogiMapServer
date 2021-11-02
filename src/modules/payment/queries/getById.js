const Payment = require('../Model');
const message = require('../../utils/messages');

const paymentGetByIdQuery = (paymentId) => {
  return Payment.findById(paymentId)
    .populate({
      path: 'client',
      select: 'name',
    })
    .populate({
      path: 'order',
      select: 'description',
    })
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Payment get by id OK', doc);
      } else {
        return message.fail('No Payment for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Payment by id ERROR', err);
    });
};

module.exports = paymentGetByIdQuery;
