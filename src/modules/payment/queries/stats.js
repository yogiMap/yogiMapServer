const Payment = require('../Model');
const message = require('../../utils/messages');

const paymentStatsQuery = (query) => {
  return Payment.countDocuments(query)
    .then((docs) => {
      return message.success('Payment stat found', docs);
    })
    .catch((error) => {
      return message.fail('Payment stat error', error);
    });
};
module.exports = paymentStatsQuery;
