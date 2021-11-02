const Client = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const getById = require('../queries/getById');

const clientDeleteById = async (req, res) => {
  const clientId = get(req, 'params.clientId');
  const userId = get(req, 'user._id');
  const client = await getById(clientId);
  if (!client.success) {
    return res.status(400).json(message.fail("Client doesn't exist", client.message));
  }

  const checkEntitiesList = ['messages'];
  const connectedEntities = checkEntitiesList.filter((el) => client.payload[el].length);
  if (connectedEntities.length) {
    return res
      .status(400)
      .json(
        message.fail(
          `You cannot delete a client with existed connections. Check ${connectedEntities.join(
            ', ',
          )}`,
        ),
      );
  }

  Client.deleteOne({ _id: clientId })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Client deleted'));
      } else {
        res.status(400).json(message.fail('Client not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('CLIENT_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Client',
        entityId: clientId,
        user: userId,
        controller: 'clientCreate',
      });

      res.status(400).json(message.fail('Client delete error', analyticsId));
    });
};

module.exports = clientDeleteById;
