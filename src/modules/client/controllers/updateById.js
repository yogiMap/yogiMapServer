const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const clientUpdateByIdQuery = require('../queries/updateById');

module.exports = async function clientUpdateById(req, res) {
  const clientId = get(req, 'params.clientId');
  const userId = get(req, 'user._id');

  const address = {
    addressLine1: get(req, 'body.addressLine1', ''),
    addressLine2: get(req, 'body.addressLine2', ''),
    city: get(req, 'body.city', ''),
    state: get(req, 'body.state', ''),
    zipCode: get(req, 'body.zipCode', ''),
    countryName: get(req, 'body.countryName', ''),
    additionalInfo: get(req, 'body.addressAdditionalInfo', ''),
  };

  address.address = `${address.addressLine1} ${address.addressLine2} ${address.city} ${address.state} ${address.zipCode} ${address.countryName}`;

  const phoneNumber = get(req, 'body.phoneNumber1', {});

  const firstName = get(req, 'body.firstName', '');
  const lastName = get(req, 'body.lastName', '');
  const name = `${firstName} ${lastName}`.trim();

  const clientUpdateRequest = clientUpdateByIdQuery({
    clientId,
    values: { ...req.body, name, phoneNumber },
  });
  //
  // // Запускаем запросы параллельно
  // const PromiseAllResult = await Promise.all([ clientUpdateRequest]);
  //
  // const addressUpdateResult = PromiseAllResult[0];
  // const clientUpdateResult = PromiseAllResult[1];

  if (clientUpdateRequest.success) {
    res.status(200).json(message.success('Client updated'));
  } else {
    const analyticsId = analytics('CLIENT_UPDATE_BY_ID_ERROR', {
      body: req.body,
      entity: 'Client',
      entityId: clientId,
      user: userId,
      controller: 'clientUpdateById',
    });

    res.status(400).json(message.fail('Client update error', analyticsId));
  }
};
