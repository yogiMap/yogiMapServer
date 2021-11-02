const message = require('../../utils/messages');
const Payment = require('../Model');
const analytics = require('../../analytics/controllers/analytics');

const paymentsGetByOrderIdQuery = ({ orderId, userId }) => {
  return Payment.find({ order: orderId })
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Payment get by orderId OK', doc);
      } else {
        return message.fail('No Payment for provided orderId');
      }
    })
    .catch((error) => {
      const analyticsId = analytics('PAYMENT_GET_BY_ORDER_ID_ERROR', {
        error,
        entity: 'Order',
        user: userId,
        controller: 'getPaymentsByOrder',
      });

      return message.fail('Payment get error', analyticsId);
    });
};

module.exports = paymentsGetByOrderIdQuery;
