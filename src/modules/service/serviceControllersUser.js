const message = require('../utils/messages');
const faker = require('faker');
const User = require('../user/userModel');
const mongoose = require('mongoose');

const serviceControllersUser = (req, res) => {
  for (let i = 0; i < 100; i++) {
    const fn = faker.name.firstName();
    const ln = faker.name.lastName();
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName: fn,
      lastName: ln,
      name: `${fn} ${ln}`,
      description: faker.lorem.paragraphs(1),
      owner: '60a86950168202222003bc13',
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      password: 123123,
    });
    console.log('HERE');

    user
      .save()
      .then(() => {})
      .catch((error) => {
        console.log(error);
        console.log('=========================');
      });
  }

  res.status(200).json(message.success('Service'));
};

module.exports = serviceControllersUser;
