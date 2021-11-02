const Classes = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const classesGetById = (req, res) => {
  const classesId = get(req, 'params.classesId');
  const userId = get(req, 'user._id');

  Classes.findById(classesId)
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
        res.status(200).json(message.success('Get Classes by id ok', doc));
      } else {
        res.status(404).json(message.fail('No classes for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('CLASSES_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Classes',
        user: userId,
        controller: 'classesGetById',
      });

      res.status(400).json(message.fail('Classes get error', analyticsId));
    });
};

module.exports = classesGetById;
