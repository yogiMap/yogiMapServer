const mongoose = require('mongoose');
const Payment = require('../Model');
const message = require('../../utils/messages');

module.exports = async function createPaymentQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const payment = new Payment({
    _id,
    ...values,
  });

  return payment
    .save()
    .then(() => {
      return message.success('Payment created', _id);
    })
    .catch((err) => {
      return message.fail('Payment create error', err);
    });
};
