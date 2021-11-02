const ClassType = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const classTypeGetById = (req, res) => {
  const classTypeId = get(req, 'params.classTypeId');
  const userId = get(req, 'user._id');

  ClassType.findById(classTypeId)
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    .populate({
      path: 'owner',
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
        res.status(200).json(message.success('Get ClassType by id ok', doc));
      } else {
        res.status(404).json(message.fail('No classType for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('ClassType_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'ClassType',
        user: userId,
        controller: 'classTypeGetById',
      });

      res.status(400).json(message.fail('ClassType get error', analyticsId));
    });
};

module.exports = classTypeGetById;
