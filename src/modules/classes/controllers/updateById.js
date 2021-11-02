const Classes = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function classesUpdateById(req, res) {
  const classesId = get(req, 'params.classesId');
  const userId = get(req, 'user._id');

  Classes.updateOne({ _id: classesId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Classes updated'));
      } else {
        res.status(400).json(message.fail('Classes not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('CLASSES_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Classes',
        entityId: classesId,
        user: userId,
        controller: 'classesUpdateById',
      });

      res.status(400).json(message.fail('Classes update error', analyticsId));
    });
};
