const message = require('../utils/messages');
const faker = require('faker');
//const Address = require('../address/Model');
const mongoose = require('mongoose');

const serviceControllersAddress = (req, res) => {
  for (let i = 0; i < 200; i++) {
    const address = new Address({
      _id: new mongoose.Types.ObjectId(),

      owner: '5eae50fc12011e161e931cc3',
      name: faker.finance.account(),

      address: faker.address.streetAddress(),
      addressLine1: faker.address.streetAddress(),
      addressLine2: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      countryName: faker.address.country(),
      countryCode: faker.address.countryCode(),
      zipCode: faker.address.zipCode(),
      addressAdditionalInfo: faker.address.secondaryAddress(),
    });

    address
      .save()
      .then(() => {})
      .catch((error) => {
        console.log(error);
        console.log('=========================');
      });
  }

  res.status(200).json(message.success('Service'));
};

module.exports = serviceControllersAddress;
