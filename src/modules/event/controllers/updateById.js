const Event = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

module.exports = async function eventUpdateById(req, res) {
  const eventId = get(req, 'params.eventId');
  const userId = get(req, 'user._id');

  Event.updateOne({ _id: eventId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Event updated'));
      } else {
        res.status(400).json(message.fail('Event not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('EVENT_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Event',
        entityId: eventId,
        user: userId,
        controller: 'eventUpdateById',
      });

      res.status(400).json(message.fail('Event update error', analyticsId));
    });
};
