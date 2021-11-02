const Classes = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const classesStats = async (req, res) => {
  const userId = get(req, 'user._id');
  try {
    const totalCount = await Classes.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Classes Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('CLASSES_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Classes',
      user: userId,
      controller: 'classesStats',
    });

    res.status(400).json(message.fail('Classes Stats error', analyticsId));
  }
};

module.exports = classesStats;
