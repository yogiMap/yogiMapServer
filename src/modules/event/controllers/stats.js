const Event = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const eventStats = async (req, res) => {
  const userId = get(req, 'user._id');
  try {
    const totalCount = await Event.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Event Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('EVENT_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Event',
      user: userId,
      controller: 'eventStats',
    });

    res.status(400).json(message.fail('Event Stats error', analyticsId));
  }
};

module.exports = eventStats;
