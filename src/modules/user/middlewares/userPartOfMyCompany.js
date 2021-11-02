const User = require('../userModel');
const message = require('../../utils/messages');
const get = require('lodash');
const userCan = require('../../permission/userCheckPerm');

const userPartOfMyCompany = async (req, res, next) => {
  // is Admin
  const roles = get(req, 'user.roles', []);
  console.log(roles, '=================================');

  const userHasPermission = userCan(roles, 'user.get.any');

  if (userHasPermission) next();
  else {
    const requestedUserId = get(req, 'params.userId', '');

    // Получаем id текущего пользователя
    const currentUserId = get(req, 'user._id');

    // Если получаем себя
    if (requestedUserId === currentUserId) next();
    else {
      const userResult = await User.findById(requestedUserId)
        .exec()
        .then((doc) => doc._doc)
        .catch((err) => err);

      let requestedUserTeacherAccountId = get(userResult, 'teacherAccount', '');
      if (requestedUserTeacherAccountId) {
        requestedUserTeacherAccountId = requestedUserTeacherAccountId.toString();
      }

      let currentUserTeacherAccountId = get(req, 'user.teacherAccount', '');
      if (currentUserTeacherAccountId) {
        currentUserTeacherAccountId = currentUserTeacherAccountId.toString();
      }

      if (requestedUserTeacherAccountId === currentUserTeacherAccountId) next();
      else
        res.status(400).json(message.fail('Requested user is not part of your Teacher'));
    }
  }
};

module.exports = userPartOfMyTeacher;
