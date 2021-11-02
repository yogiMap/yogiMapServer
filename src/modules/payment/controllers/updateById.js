const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const paymentUpdateByIdQuery = require('../queries/updateById');

module.exports = async function paymentUpdateById(req, res) {
  const paymentId = get(req, 'params.paymentId');
  const userId = get(req, 'user._id');

  const isPaymentCheck = get(req, 'body.paymentType');
  if (isPaymentCheck !== 'check') req.body.checkNumber = null;

  const paymentUpdateByIdQueryResult = await paymentUpdateByIdQuery({
    paymentId,
    values: req.body,
  });

  if (paymentUpdateByIdQueryResult.success) {
    res.status(200).json(paymentUpdateByIdQueryResult);
  } else {
    //
    const analyticsId = analytics('PAYMENT_UPDATE_BY_ID_ERROR', {
      error: paymentUpdateByIdQueryResult.payload,
      body: req.body,
      entity: 'Payment',
      entityId: paymentId,
      user: userId,
      controller: 'paymentUpdateById',
    });

    res.status(400).json(message.fail('Payment update error', analyticsId));
  }
};
