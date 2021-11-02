const bcrypt = require('bcryptjs');

module.exports = function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
