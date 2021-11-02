const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const teacherAccountStatsQuery = require('../queries/stats');

module.exports = async function teacherAccountStats(req, res) {
  const userId = get(req, 'user._id');

  const teacherAccountStatsQueryResult = await teacherAccountStatsQuery();
  const totalCount = teacherAccountStatsQueryResult.payload;

  if (teacherAccountStatsQueryResult.success) {
    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 100,
    };
    res.status(200).json(message.success('TeacherAccount Stats ok', result));
  } else {
    const analyticsId = analytics('TEACHER_ACCOUNT_STATS_ERROR', {
      error: ['TeacherAccount not found', teacherAccountStatsQueryResult],
      body: req.body,
      entity: 'TeacherAccount',
      user: userId,
      controller: 'teacherAccountStats',
    });

    res.status(400).json(message.fail('TeacherAccount Stats error', analyticsId));
  }
};
