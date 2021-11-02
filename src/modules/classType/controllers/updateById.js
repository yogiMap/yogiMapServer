const ClassType = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function classTypeUpdateById(req, res) {
  const classTypeId = get(req, 'params.classTypeId');
  const userId = get(req, 'user._id');

  ClassType.updateOne({ _id: classTypeId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('ClassType updated'));
      } else {
        res.status(400).json(message.fail('ClassType not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('ClassType_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'ClassType',
        entityId: classTypeId,
        user: userId,
        controller: 'classTypeUpdateById',
      });

      res.status(400).json(message.fail('ClassType update error', analyticsId));
    });
};
