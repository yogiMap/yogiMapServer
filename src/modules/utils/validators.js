const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

//TODO: delete one exp for email
const emailRegExp =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const isValidEmail = (email) =>
  email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

// 1. (?!.*[\s]) no spaces
// 2. (?=.*\d) digits
// 3. (?=.*[a-z]) lower case
// 3. (?=.*[A-Z]) upper case
// min 7, max 20
const checkPassword = (password) =>
  /^((?!.*[\s])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])).{7,20}$/.test(password);

const validateObjectId = (id) =>
  ObjectId.isValid(id) && new ObjectId(id).toString() === id;

module.exports = {
  emailRegExp,
  isValidEmail,
  checkPassword,
  validateObjectId,
};
