const StudentAccount = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const studentAccountGetById = (req, res) => {
  const studentAccountId = get(req, 'params.studentAccountId');
  const userId = get(req, 'user._id');

  console.log(studentAccountId);

  StudentAccount.findById(studentAccountId)
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    .populate({
      path: 'studentAccountAccount',
      select: 'name phoneNumber email',
    })

    .populate({
      path: 'classes',
      select: 'name focus style classType description',
    })

    .populate({
      path: 'event',
      select: 'name focus style classType description',
    })

    .populate({
      path: 'classType',
      options: { sort: { date: -1 } },
      select: 'name',
    })

    .populate({
      path: 'style',
      options: { sort: { date: -1 } },
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
        res.status(200).json(message.success('Get StudentAccount by id ok', doc));
      } else {
        res.status(404).json(message.fail('No studentAccountAccount for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('StudentAccount_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'StudentAccount',
        user: userId,
        controller: 'studentAccountGetById',
      });

      res.status(400).json(message.fail('StudentAccount get error', analyticsId));
    });
};

module.exports = studentAccountGetById;
