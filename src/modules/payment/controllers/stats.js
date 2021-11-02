const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const paymentStatsQuery = require('../queries/stats');

module.exports = async function paymentStats(req, res) {
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');

  const query = { teacherAccount: { $eq: teacherAccountId } };

  const paymentStatsQueryResult = await paymentStatsQuery(query);
  const totalCount = paymentStatsQueryResult.payload;

  if (paymentStatsQueryResult.success) {
    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 100,
    };
    res.status(200).json(message.success('Payment Stats ok', result));
  } else {
    //
    const analyticsId = analytics('PAYMENT_STATS_ERROR', {
      error: ['Payments not found', paymentStatsQueryResult],
      body: req.body,
      entity: 'Payment',
      user: userId,
      controller: 'paymentStats',
    });

    res.status(400).json(message.fail('Payment Stats error', analyticsId));
  }
};
