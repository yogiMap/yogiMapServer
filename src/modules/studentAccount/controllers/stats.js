const StudentAccount = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const studentAccountStats = async (req, res) => {
  const userId = get(req, 'user._id');
  try {
    const totalCount = await StudentAccount.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('StudentAccount Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('StudentAccount_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'StudentAccount',
      user: userId,
      controller: 'studentAccountStats',
    });

    res.status(400).json(message.fail('StudentAccount Stats error', analyticsId));
  }
};

module.exports = studentAccountStats;
