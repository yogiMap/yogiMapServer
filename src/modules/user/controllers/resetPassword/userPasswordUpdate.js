const bcrypt = require('bcryptjs');
const message = require('../../../utils/messages');

const { get } = require('lodash');
const validatePasswordByUserIdQuery = require('../../queries/validatePasswordByUserId');
const updateUserPasswordByIdQuery = require('../../queries/updateUserPasswordById');
const analytics = require('../../../analytics/controllers/analytics');

module.exports = async function userPasswordUpdate(req, res) {
  const userId = get(req, 'user._id');
  const password = get(req, 'body.password');
  const newPassword = get(req, 'body.newPassword');

  const hashPassword = (newPassword) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(newPassword, salt);
  };

  const encryptedNewPassword = hashPassword(newPassword);

  const validatePasswordByUserIdQueryResult = await validatePasswordByUserIdQuery(
    userId,
    password,
  );

  if (validatePasswordByUserIdQueryResult.success) {
    const updateUserPasswordByIdQueryResult = await updateUserPasswordByIdQuery({
      userId,
      encryptedNewPassword,
    });
    if (updateUserPasswordByIdQueryResult.success) {
      res.status(200).json(message.success('Password updated', '', false));
    } else {
      res.status(400).json(message.fail('Update password fail', ''));
    }
  } else {
    const analyticsId = analytics('USER_OLD_PASSWORD_VALIDATE_BY_ID_FAIL', {
      reason: validatePasswordByUserIdQueryResult,
      body: req.body,
      entity: 'User',
      user: userId,
      controller: 'updateUserPasswordById',
    });

    res.status(400).json(message.fail('WRONG OLD PASSWORD', analyticsId));
  }
};
