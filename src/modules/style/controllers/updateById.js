const Style = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function styleUpdateById(req, res) {
  const styleId = get(req, 'params.styleId');
  const userId = get(req, 'user._id');

  Style.updateOne({ _id: styleId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Style updated'));
      } else {
        res.status(400).json(message.fail('Style not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('STYLE_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Style',
        entityId: styleId,
        user: userId,
        controller: 'styleUpdateById',
      });

      res.status(400).json(message.fail('Style update error', analyticsId));
    });
}
