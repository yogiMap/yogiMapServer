const Payment = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');

function getLastPayment(teacherAccountId) {
  return Payment.findOne(
    { teacherAccount: teacherAccountId },
    {},
    { sort: { createdAt: -1 } },
  )
    .exec()
    .then((doc) => {
      return message.success('Latest Payment', doc);
    })
    .catch((error) => {
      console.log(error);
      return message.fail('Latest Payment error', error);
    });
}

module.exports = async function getNextPaymentCodeQuery(teacherAccountId) {
  const getLastPaymentResult = await getLastPayment(teacherAccountId);

  if (getLastPaymentResult.success) {
    const paymentCode = get(getLastPaymentResult, 'payload.code');
    if (!paymentCode) return 'PAY-1';
    else {
      const currentCount = Number(paymentCode.split('-')[1]);
      const nextCount = currentCount + 1;
      return `PAY-${nextCount}`;
    }
  } else {
    return 'PAY-1';
  }
};
