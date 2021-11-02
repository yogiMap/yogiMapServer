const Payment = require('../Model');
const message = require('../../utils/messages');

const paymentSearchQuery = ({ query, page, limit }) => {
  return Payment.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .populate({
      path: 'client',
      select: 'name',
    })
    .populate({
      path: 'order',
      select: 'description',
    })
    .exec()
    .then((docs) => {
      return message.success('Payment found', docs);
    })
    .catch((error) => {
      return message.fail('Payment search error', error);
    });
};

module.exports = paymentSearchQuery;
