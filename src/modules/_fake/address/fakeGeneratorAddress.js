const message = require("../../utils/messages");
const faker = require("faker");
const Address = require("../../address/Model");
const mongoose = require("mongoose");
const { get } = require("lodash");

const fakeGeneratorAddress = (req, res) => {
  const userId = get(req, "user._id");
  const count = get(req, "body.count", 100);
  const clientId = get(req, "body.client", "5f69e2fd921b2805a8a4337f");

  for (let i = 0; i < count; i++) {
    const addressFields = {
      _id: new mongoose.Types.ObjectId(),
      owner: userId,
      client: clientId,
      addressLine1: faker.address.streetAddress(),
      addressLine2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      countryName: "USA",
      countryCode: faker.address.countryCode(),
      zipCode: faker.address.zipCode()
    };

    const { addressLine1, addressLine2, city, state, countryName, zipCode } =
      addressFields;

    addressFields.address = `${addressLine1} ${addressLine2} ${city} ${state} ${zipCode} ${countryName}`;

    const address = new Address(addressFields);
    address
      .save()
      .then(() => {
      })
      .catch((error) => {
        console.log(error);
        console.log("=========================");
      });
  }
  res.status(200).json(message.success("Addresses have been created"));
};

module.exports = fakeGeneratorAddress;
