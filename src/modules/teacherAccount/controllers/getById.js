// const  TeacherAccount = require('../Model)'
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const teacherAccountGetByIdQuery = require('../queries/getById');

module.exports = async function teacherAccountGetById(req, res) {
  const teacherAccountId = get(req, 'params.teacherAccountId');
  const userId = get(req, 'user._id');

  const teacherAccountGetByIdQueryResult = await teacherAccountGetByIdQuery(
    teacherAccountId,
  );

  if (teacherAccountGetByIdQueryResult.success) {
    res.status(200).json(teacherAccountGetByIdQueryResult);
  } else {
    const analyticsId = analytics('TEACHER_ACCOUNT_GET_BY_ID_ERROR', {
      error: teacherAccountGetByIdQueryResult.payload,
      body: req.body,
      entity: 'TeacherAccount',
      user: userId,
      controller: 'teacherAccountGetById',
    });
    res.status(400).json(message.fail('TeacherAccount get error', analyticsId));
  }
};
