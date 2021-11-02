const TeacherAccount = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const teacherAccountGetAll = (req, res) => {
  const userId = get(req, 'user._id');

  TeacherAccount.find()
    .sort({ createdAt: -1 })
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Get all TeacherAccounts ok', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('TEACHER_ACCOUNT_GET_ALL_ERROR', {
        error,
        body: req.body,
        entity: 'TeacherAccount',
        user: userId,
        controller: 'teacherAccountGetAll',
      });

      res.status(400).json(message.fail('TeacherAccount get all error', analyticsId));
    });
};

module.exports = teacherAccountGetAll;
