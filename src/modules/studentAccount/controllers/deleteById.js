const StudentAccount = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const studentAccountDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.studentAccountId');

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  StudentAccount.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('StudentAccount deleted'));
      } else {
        res.status(400).json(message.fail('StudentAccount not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('StudentAccount_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'StudentAccount',
        entityId: _id,
        user: userId,
        controller: 'studentAccountCreate',
      });

      res.status(400).json(message.fail('StudentAccount delete error', analyticsId));
    });
};

module.exports = studentAccountDeleteById;
