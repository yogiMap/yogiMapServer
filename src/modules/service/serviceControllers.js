const message = require('../utils/messages');
const faker = require('faker');
const Base = require('../_base/Model');
const mongoose = require('mongoose');

const service = (req, res) => {
  for (let i = 0; i < 200; i++) {
    const base = new Base({
      _id: new mongoose.Types.ObjectId(),
      name: faker.commerce.productName(),
      description: faker.lorem.paragraphs(1),
      owner: '5eae50fc12011e161e931cc3',
    });

    base
      .save()
      .then(() => {})
      .catch((error) => {
        console.log(error);
        console.log('=========================');
      });
  }

  res.status(200).json(message.success('Service'));
};

module.exports = service;
