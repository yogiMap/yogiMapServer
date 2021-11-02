const ClassType = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const classTypeStats = async (req, res) => {
  const userId = get(req, 'user._id');
  try {
    const totalCount = await ClassType.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('ClassType Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('ClassType_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'ClassType',
      user: userId,
      controller: 'classTypeStats',
    });

    res.status(400).json(message.fail('ClassType Stats error', analyticsId));
  }
};

module.exports = classTypeStats;
