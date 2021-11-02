const Style = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const styleStats = async (req, res) => {
  const userId = get(req, 'user._id');
  try {
    const totalCount = await Style.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Style Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('STYLE_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Style',
      user: userId,
      controller: 'styleStats',
    });

    res.status(400).json(message.fail('Style Stats error', analyticsId));
  }
};

module.exports = styleStats;
