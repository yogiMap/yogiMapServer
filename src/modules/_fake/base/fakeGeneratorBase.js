const message = require('../../utils/messages');
const faker = require('faker');
const Base = require('../../_base/Model');
const mongoose = require('mongoose');
const { get } = require('lodash');

const fakeGeneratorBase = (req, res) => {
  const userId = get(req, 'user._id');
  const count = get(req, 'body.count', 100);
  const clientId = get(req, 'body.client', '5f69e2fd921b2805a8a4337f');

  for (let i = 0; i < count; i++) {
    const baseFields = {
      _id: new mongoose.Types.ObjectId(),
      owner: userId,
      client: clientId,
      description: faker.name.orderDescriptor(),
      name: faker.name.orderTitle(),
    };

    const base = new Base(baseFields);
    base
      .save()
      .then(() => {})
      .catch((error) => {
        console.log(error);
        console.log('=========================');
      });
  }
  res.status(200).json(message.success('Base have been created'));
};

module.exports = fakeGeneratorBase;
