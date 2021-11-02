const mongoose = require('mongoose');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createClassTypeQuery = require('../queries/create');
const addClassTypeToTeacherAccountQuery = require('../queries/addClassTypeToTeacherAccount');
const ClassType = require('../Model');
const escapeRegExp = require('../../utils/escapeRegExp');

module.exports = async function classTypeCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const teacherAccountId = get(req, 'body.teacherAccountId');
  const description = get(req, 'body.description');

  const isClassTypeExist = await ClassType.count({
    name: { $eq: escapeRegExp(name) },
  });

  if (isClassTypeExist) {
    return res.status(400).json(message.fail('ClassType exist'));
  }

  const createClassTypeQueryResult = await createClassTypeQuery({
    _id,
    name,
    description,
    owner: userId,
  });

  const addClassTypeTeacherAccountResult = await addClassTypeToTeacherAccountQuery({
    classTypeId: _id,
    teacherAccountId,
  });

  console.log(addClassTypeTeacherAccountResult, createClassTypeQueryResult);

  if (createClassTypeQueryResult.success && addClassTypeTeacherAccountResult.success) {
    res.status(200).json(createClassTypeQueryResult);
  } else {
    const analyticsId = analytics('ClassType_CREATE_ERROR', {
      error: createClassTypeQueryResult.payload,
      body: req.body,
      entity: 'ClassType',
      entityId: _id,
      user: userId,
      controller: 'classTypeCreat',
    });

    res.status(400).json(message.fail('ClassType create error', analyticsId));
  }
};
