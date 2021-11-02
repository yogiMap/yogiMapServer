const User = require('../userModel');

const checkIfUserExists = (email) => {
  return User.findOne({ email: email })
    .exec()
    .then((doc) => !!doc)
    .catch(() => false);
};

module.exports = checkIfUserExists;
