const Base = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const baseStats = async (req, res) => {
  const userId = get(req, 'user._id');
  const companyAccountId = get(req, 'user.companyAccount');

  const query = { companyAccount: { $eq: companyAccountId } };
  try {
    const totalCount = await Base.countDocuments(query);

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Base Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('BASE_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Base',
      user: userId,
      controller: 'baseStats',
    });

    res.status(400).json(message.fail('Base Stats error', analyticsId));
  }
};

module.exports = baseStats;
