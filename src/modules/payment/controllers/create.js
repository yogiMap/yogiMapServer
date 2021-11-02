const mongoose = require('mongoose');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createPaymentQuery = require('../queries/create');
const clientAddPaymentQuery = require('../../client/queries/addPayment');
const getNextPaymentCodeQuery = require('../queries/getNextPaymentCodeQuery');
const isClientInTeacher = require('../../client/queries/isClientInTeacher');

module.exports = async function paymentCreate(req, res) {
  const _id = new mongoose.Types.ObjectId();

  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');
  const clientId = get(req, 'body.client');

  // Check client in Account
  const isClientInTeacherResult = await isClientInTeacher(clientId, teacherAccountId);
  if (isClientInTeacherResult.fail && !isClientInTeacherResult.payload) {
    return res
      .status(400)
      .json(message.fail('Client is not on current Teacher Account', null, false));
  }

  const code = await getNextPaymentCodeQuery(teacherAccountId);

  const createPaymentQueryResult = await createPaymentQuery({
    _id,
    code,
    date: get(req, 'body.date'),
    client: clientId,
    order: get(req, 'body.order'),
    amount: get(req, 'body.amount'),
    checkNumber: get(req, 'body.checkNumber'),
    creditCardLast4: get(req, 'body.creditCardLast4'),
    creditCardStatus: get(req, 'body.creditCardStatus'),
    paymentType: get(req, 'body.paymentType'),
    creditCardEmail: get(req, 'body.creditCardEmail'),
    owner: userId,
    teacherAccount: teacherAccountId,
  });

  const clientAddPayment = clientAddPaymentQuery({ paymentId: _id, clientId });

  const PromiseAllResult = await Promise.all([
    createPaymentQueryResult,
    clientAddPayment,
  ]);

  const createPaymentResult = PromiseAllResult[0];
  const clientAddPaymentResult = PromiseAllResult[1];

  if (createPaymentResult.success && clientAddPaymentResult.success) {
    res.status(200).json(createPaymentQueryResult);
  } else {
    //
    const analyticsId = analytics('PAYMENT_CREATE_ERROR', {
      createPaymentError: createPaymentResult.payload,
      clientAddPaymentError: clientAddPaymentResult.payload,
      body: req.body,
      entity: 'Payment',
      entityId: _id,
      user: userId,
      controller: 'paymentCreate',
    });

    res.status(400).json(message.fail('Payment create error', analyticsId));
  }
};
