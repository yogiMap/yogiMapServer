const message = require('../../utils/messages');
const { get } = require('lodash');
const Client = require('../Model');
const { userCan } = require('../../permission/userCheckPerm');

const clientPartOfMyCompany = async (req, res, next) => {
  // is Admin
  const roles = get(req, 'userData.roles', []);
  const userHasPermission = userCan(roles, 'client.get.any');

  if (userHasPermission) next();
  else {
    const clientId = get(req, 'params.clientId') || get(req, 'body.clientId');

    let currentUserTeacherAccountId = get(req, 'user.teacherAccount', '');
    if (currentUserTeacherAccountId) {
      currentUserTeacherAccountId = currentUserTeacherAccountId.toString();
    }

    const clientResult = await Client.findById(clientId)
      .exec()
      .then((doc) => doc._doc)
      .catch((err) => err);

    let requestedClientTeacherAccountId = get(clientResult, 'teacherAccount', '');
    if (requestedClientTeacherAccountId) {
      requestedClientTeacherAccountId = requestedClientTeacherAccountId.toString();
    }

    if (requestedClientTeacherAccountId === currentUserTeacherAccountId) next();
    else
      res.status(400).json(message.fail('Requested client is not part of your Company'));
  }
};

module.exports = clientPartOfMyCompany;
