const mongoose = require('mongoose');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createStudentAccountQuery = require('../queries/create');
const StudentAccount = require('../Model');
const escapeRegExp = require('../../utils/escapeRegExp');
const userUpdateByIdQuery = require('../../user/queries/updateById');
const countStudentAccount = require('../queries/countStudentAccount');
const addStudentAccountRole = require('../queries/addStudentAccountRole');

module.exports = async function studentAccountCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Читаем данные из запроса
  const firstName = get(req, 'body.firstName');
  const lastName = get(req, 'body.lastName');
  const name = `${firstName} ${lastName}`;
  const description = get(req, 'body.description');
  const focus = get(req, 'body.focus');
  const phoneNumber = get(req, 'body.phoneNumber', {});
  const personalAddress = get(req, 'body.personalAddress');
  const address = get(req, 'body.address');
  const addressLine1 = get(req, 'body.addressLine1');
  const addressLine2 = get(req, 'body.addressLine2');
  const city = get(req, 'body.city');
  const state = get(req, 'body.state');
  const country = get(req, 'body.country');
  const zipCode = get(req, 'body.zipCode');
  const timeZone = get(req, 'body.timeZone');
  const isTeacher = get(req, 'body.isTeacher');

  // check if current user has an StudentAccount Account
  const countStudentAccountsResult = await countStudentAccount(userId);
  if (countStudentAccountsResult.success) {
    if (countStudentAccountsResult.payload >= 1) {
      return res
        .status(400)
        .json(
          message.fail(
            'StudentAccount Account exists. Only one StudentAccount per owner',
          ),
        );
    }
  } else {
    return res
      .status(400)
      .json(message.fail('StudentAccount Account. Check count error'));
  }

  const isStudentAccountExist = await StudentAccount.count({
    name: { $eq: escapeRegExp(name) },
  });

  if (isStudentAccountExist) {
    return res.status(400).json(message.fail('StudentAccount exist'));
  }

  const createStudentAccountQueryResult = await createStudentAccountQuery({
    _id,
    firstName,
    lastName,
    description,
    focus,
    phoneNumber,
    personalAddress,
    address,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    zipCode,
    timeZone,
    isTeacher,
    owner: userId,
  });

  const userUpdateByStudentAccountId = await userUpdateByIdQuery({
    userId,
    values: { studentAccount: _id },
  });

  const addStudentAccountRoleResult = await addStudentAccountRole(userId);

  if (
    createStudentAccountQueryResult.success &&
    userUpdateByStudentAccountId.success &&
    addStudentAccountRoleResult.success
  ) {
    res.status(200).json(createStudentAccountQueryResult);
  } else {
    const analyticsId = analytics('StudentAccount_CREATE_ERROR', {
      error: createStudentAccountQueryResult.payload,
      body: req.body,
      entity: 'StudentAccount',
      entityId: _id,
      user: userId,
      controller: 'studentAccountCreate',
    });

    res.status(400).json(message.fail('StudentAccount create error', analyticsId));
  }
};
