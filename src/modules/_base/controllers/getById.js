const Base = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const baseGetById = (req, res) => {
  const baseId = get(req, 'params.baseId');
  const userId = get(req, 'user._id');

  Base.findById(baseId)
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    // .populate({
    //   path: 'members',
    //   select: 'name links',
    // })
    // .populate({
    //   path: 'lectures',
    //   options: { sort: { date: -1 } },
    //   populate: { path: 'understood', select: 'name' },
    // })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('Get Base by id ok', doc));
      } else {
        res.status(404).json(message.fail('No base for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('BASE_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Base',
        user: userId,
        controller: 'baseGetById',
      });

      res.status(400).json(message.fail('Base get error', analyticsId));
    });
};

module.exports = baseGetById;
