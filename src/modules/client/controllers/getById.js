const Client = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');

const clientGetById = (req, res) => {
  const clientId = get(req, 'params.clientId');
  const userId = get(req, 'user._id');

  Client.findById(clientId)
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    .populate({
      path: 'teacherAccount',
      select: 'name',
    })

    .exec()
    .then((doc) => {
      if (doc) {
        return res.status(200).json(message.success('Get Client by id ok', doc));
      } else {
        return res.status(404).json(message.fail('No client for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('CLIENT_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Client',
        user: userId,
        controller: 'clientGetById',
      });

      return res.status(400).json(message.fail('Client get error', analyticsId));
    });
};

module.exports = clientGetById;
