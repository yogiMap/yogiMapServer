const Style = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const styleGetById = (req, res) => {
  const styleId = get(req, 'params.styleId');
  const userId = get(req, 'user._id');

  Style.findById(styleId)
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
        res.status(200).json(message.success('Get Style by id ok', doc));
      } else {
        res.status(404).json(message.fail('No style for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('STYLE_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Style',
        user: userId,
        controller: 'styleGetById',
      });

      res.status(400).json(message.fail('Style get error', analyticsId));
    });
};

module.exports = styleGetById;
