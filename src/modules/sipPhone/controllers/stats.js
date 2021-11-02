const SipPhone = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const sipPhoneStats = async (req, res) => {
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');

  const query = { teacherAccount: { $eq: teacherAccountId } };
  try {
    const totalCount = await SipPhone.countDocuments(query);

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('SipPhone Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('SipPhone_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'SipPhone',
      user: userId,
      controller: 'sipPhoneStats',
    });

    res.status(400).json(message.fail('SipPhone Stats error', analyticsId));
  }
};

module.exports = sipPhoneStats;
