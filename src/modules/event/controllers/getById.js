const Event = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const eventGetById = (req, res) => {
  const eventId = get(req, 'params.eventId');
  const userId = get(req, 'user._id');

  Event.findById(eventId)
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    .populate({
      path: 'teacherAccount',
      select: 'name',
    })

    .populate({
      path: 'style',
      select: 'name',
    })

    .populate({
      path: 'classType',
      select: 'name',
    })

    // .populate({
    //   path: 'lectures',
    //   options: { sort: { date: -1 } },
    //   populate: { path: 'understood', select: 'name' },
    // })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('Get Event by id ok', doc));
      } else {
        res.status(404).json(message.fail('No event for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('EVENT_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Event',
        user: userId,
        controller: 'eventGetById',
      });

      res.status(400).json(message.fail('Event get error', analyticsId));
    });
};

module.exports = eventGetById;
