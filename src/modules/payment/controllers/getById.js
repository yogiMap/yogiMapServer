const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const paymentGetByIdQuery = require('../queries/getById');

module.exports = async function paymentGetById(req, res) {
  const paymentId = get(req, 'params.paymentId');
  const userId = get(req, 'user._id');

  const paymentGetByIdQueryResult = await paymentGetByIdQuery(paymentId);

  if (paymentGetByIdQueryResult.success) {
    res.status(200).json(paymentGetByIdQueryResult);
  } else {
    //
    const analyticsId = analytics('PAYMENT_GET_BY_ID_ERROR', {
      error: paymentGetByIdQueryResult.payload,
      body: req.body,
      entity: 'Payment',
      user: userId,
      controller: 'paymentGetById',
    });

    res.status(404).json(message.fail('No payment for provided id', analyticsId));
  }
};
