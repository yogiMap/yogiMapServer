const message = require('../utils/messages');
const faker = require('faker');
// const Base = require ( '../_base/Model');
const Client = require('../client/Model');
const mongoose = require('mongoose');

const serviceControllersClient = (req, res) => {
  for (let i = 0; i < 200; i++) {
    const fn = faker.name.firstName();
    const ln = faker.name.lastName();

    const base = new Client({
      _id: new mongoose.Types.ObjectId(),

      owner: '5eae50fc12011e161e931cc3',

      firstName: fn,
      lastName: ln,
      name: `${fn} ${ln}`,
      company: faker.company.companyName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      phoneNumberSecondary: faker.phone.phoneNumber(),
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

module.exports = serviceControllersClient;
