const User = require('../userModel');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');

const userGetById = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .select('name email phone roles isTeacher createdAt lastLogin timeZone avatar')
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    .populate({
      path: 'teacherAccount',
      select: 'name',
    })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('User found', doc));
      } else {
        res.status(404).json(message.fail('No User for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_BY_ID_ERROR', {
        error,
        user: userId,
        controller: 'userGetById',
      });

      res.status(400).json(message.fail('User get by ID. Error', analyticsId));
    });
};

module.exports = userGetById;
