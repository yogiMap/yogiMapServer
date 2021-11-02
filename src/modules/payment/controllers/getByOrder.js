const { get } = require('lodash');
const paymentsGetByOrderIdQuery = require('../queries/getByOrderId');

const getPaymentsByOrder = async (req, res) => {
  const orderId = get(req, 'params.orderId');
  const userId = get(req, 'user._id');

  const paymentsResult = await paymentsGetByOrderIdQuery({ orderId, userId });

  if (paymentsResult.success) {
    res.status(200).json(paymentsResult);
  } else {
    res.status(400).json(paymentsResult);
  }
};

module.exports = getPaymentsByOrder;
