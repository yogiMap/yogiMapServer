const TeacherAccount = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const teacherAccountDeleteById = (req, res) => {
  const _id = get(req, 'params.teacherAccountId');
  const userId = get(req, 'user._id');

  TeacherAccount.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('TeacherAccount deleted'));
      } else {
        res.status(400).json(message.fail('TeacherAccount not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('TEACHER_ACCOUNT_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'TeacherAccount',
        entityId: _id,
        user: userId,
        controller: 'teacherAccountDeleteById',
      });

      res.status(400).json(message.fail('TeacherAccount delete error', analyticsId));
    });
};

module.exports = teacherAccountDeleteById;
