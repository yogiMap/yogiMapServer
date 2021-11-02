const Base = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function baseUpdateById(req, res) {
  const baseId = get(req, 'params.baseId');
  const userId = get(req, 'user._id');

  Base.updateOne({ _id: baseId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Base updated'));
      } else {
        res.status(400).json(message.fail('Base not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('BASE_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Base',
        entityId: baseId,
        user: userId,
        controller: 'baseUpdateById',
      });

      res.status(400).json(message.fail('Base update error', analyticsId));
    });
};
