const TeacherAccount = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function teacherAccountUpdateById(req, res) {
  const teacherAccountId = get(req, 'params.teacherAccountId');
  const userId = get(req, 'user._id');
  const teacherAccountNameTrimmed = get(req, 'body.name', '').trim();

  req.body.name = teacherAccountNameTrimmed;

  TeacherAccount.updateOne(
    { _id: teacherAccountId },
    { $set: req.body },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('TeacherAccount updated'));
      } else {
        res.status(400).json(message.fail('TeacherAccount not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('TEACHER_ACCOUNT_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'TeacherAccount',
        entityId: teacherAccountId,
        user: userId,
        controller: 'teacherAccountUpdateById',
      });

      res.status(400).json(message.fail('TeacherAccount update error', analyticsId));
    });
};
