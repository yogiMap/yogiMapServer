const message = require('../../utils/messages');
const { listRoles } = require('../../permission/roles');

const userGetAllRoles = (req, res) => {
  res
    .status(200)
    .json(message.success('Get all roles. Success', [...listRoles, 'admin']));
};

module.exports = userGetAllRoles;
