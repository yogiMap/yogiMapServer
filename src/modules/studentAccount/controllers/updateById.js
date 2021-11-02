const StudentAccount = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function studentAccountUpdateById(req, res) {
  const studentAccountId = get(req, 'params.studentAccountId');
  const userId = get(req, 'user._id');

  StudentAccount.updateOne({ _id: studentAccountId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('StudentAccount updated'));
      } else {
        res.status(400).json(message.fail('StudentAccount not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('StudentAccount_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'StudentAccount',
        entityId: studentAccountId,
        user: userId,
        controller: 'studentAccountUpdateById',
      });

      res.status(400).json(message.fail('StudentAccount update error', analyticsId));
    });
}
