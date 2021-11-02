const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const paymentDeleteByIdQuery = require('../queries/deleteById');
const paymentGetByIdQuery = require('../queries/getById');
const clientRemovePaymentQuery = require('../../client/queries/removePayment');

module.exports = async function paymentDeleteById(req, res) {
  const paymentId = get(req, 'params.paymentId');
  const userId = get(req, 'user._id');
  let promiseAllResults;

  const clientByPaymentIdQueryResult = await paymentGetByIdQuery(paymentId);
  const clientId = get(clientByPaymentIdQueryResult, 'payload.client._id', '').toString();

  if (clientByPaymentIdQueryResult.success) {
    const clientRemovePaymentQueryResult = clientRemovePaymentQuery({
      clientId,
      paymentId,
    });
    const paymentDeleteByIdQueryResult = paymentDeleteByIdQuery(paymentId);
    promiseAllResults = await Promise.all([
      clientRemovePaymentQueryResult,
      paymentDeleteByIdQueryResult,
    ]);
  }

  const clientRemovePaymentQueryResult = promiseAllResults[0];
  const paymentDeleteByIdQueryResult = promiseAllResults[1];

  if (paymentDeleteByIdQueryResult.success && clientRemovePaymentQueryResult.success) {
    res.status(200).json(paymentDeleteByIdQueryResult);
  } else {
    //
    const analyticsId = analytics('PAYMENT_DELETE_BY_ID_ERROR', {
      error: [
        paymentDeleteByIdQueryResult.payload,
        clientRemovePaymentQueryResult.payload,
      ],
      reason: get(paymentDeleteByIdQueryResult, 'payload.reason.message'),
      body: req.body,
      entity: 'Payment',
      entityId: paymentId,
      user: userId,
      controller: 'paymentDeleteById',
    });

    res.status(400).json(message.fail('Payment delete error', analyticsId));
  }
};
