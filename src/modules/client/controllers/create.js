const mongoose = require('mongoose');
const message = require('../../utils/messages');
const { get } = require('lodash');
const createClientQuery = require('../queries/create');
//const createServiceAddressQuery = require('../../address/queries/create');
const analytics = require('../../analytics/controllers/analytics');
const getNextClientCodeQuery = require('../queries/getNextClientCodeQuery');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

async function clientCreate(req, res) {
  // Создаем id материала который будет создан
  const clientId = new mongoose.Types.ObjectId();

  let addressId = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');

  const code = await getNextClientCodeQuery(teacherAccountId);

  const customer = await stripe.customers.create({
    name: get(req, 'body.firstName') + ' ' + get(req, 'body.lastName'),
    email: get(req, 'body.email'),
    description: 'Test Customer (created for API docs)',
  });

  const firstName = get(req, 'body.firstName', '');
  const lastName = get(req, 'body.lastName', '');
  const name = `${firstName} ${lastName}`.trim();

  // Читаем данные из запроса
  const client = {
    _id: clientId,
    code,
    addresses: [],
    firstName,
    lastName,
    name,
    teacher: get(req, 'body.teacher'),
    email: get(req, 'body.email'),
    phoneNumber: get(req, 'body.phoneNumber', null),
    owner: userId,
    messages: [],
    customerStripeId: customer.id,
    teacherAccount: teacherAccountId,
  };

  const serviceAddress = {
    _id: addressId,
    client: clientId,
    addressLine1: get(req, 'body.addressLine1', ''),
    addressLine2: get(req, 'body.addressLine2', ''),
    city: get(req, 'body.city', ''),
    state: get(req, 'body.state', ''),
    zipCode: get(req, 'body.zipCode', ''),
    countryName: get(req, 'body.countryName', ''),
    additionalInfo: get(req, 'body.additionalInfo', ''),
    owner: userId,
    isDefault: true,
    teacherAccount: teacherAccountId,
  };
  serviceAddress.address = `${serviceAddress.addressLine1} ${serviceAddress.addressLine2} ${serviceAddress.city} ${serviceAddress.state} ${serviceAddress.zipCode} ${serviceAddress.countryName}`;
  // //conditionally call create client/create address combination depending if address passed or not
  if (addressId) {
    const code = await getNextAddressCodeQuery(teacherAccountId);
    serviceAddress.code = code;
    const clientCreate = createClientQuery(client);
    // const serviceAddressCreate = createServiceAddressQuery(serviceAddress);
    const allResult = await Promise.all([clientCreate]);

    if (allResult[0].success && allResult[1].success) {
      res.status(201).json(message.success('Client created', clientId));
    } else {
      const analyticsId = analytics('CLIENT_CREATE_ERROR', {
        clientCreateError: allResult[0].payload,
        serviceAddressCreateError: allResult[1].payload,
        body: req.body,
        entity: 'Client',
        entityId: null,
        user: userId,
        controller: 'clientCreate',
      });
      res.status(400).json(message.fail('Client create error', analyticsId));
    }
  } else {
    const clientCreate = await createClientQuery(client);

    if (clientCreate.success) {
      res.status(201).json(message.success('Client created', clientId));
    } else {
      const analyticsId = analytics('CLIENT_CREATE_ERROR', {
        clientCreateError: clientCreate.payload,
        body: req.body,
        entity: 'Client',
        entityId: null,
        user: userId,
        controller: 'clientCreate',
      });
      res.status(400).json(message.fail('Client create error', analyticsId));
    }
  }
}

module.exports = clientCreate;
