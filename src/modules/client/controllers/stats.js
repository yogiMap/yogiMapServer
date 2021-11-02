const Client = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const clientStats = async (req, res) => {
  const userId = get(req, 'user._id', '');
  const teacherAccountId = get(req, 'user.teacherAccount', '');

  const query = {
    teacherAccount: { $eq: teacherAccountId },
  };

  try {
    const totalCount = await Client.countDocuments(query);

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Client Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('CLIENT_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Client',
      user: userId,
      controller: 'clientStats',
    });

    res.status(400).json(message.fail('Client Stats error', analyticsId));
  }
};

module.exports = clientStats;
