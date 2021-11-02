const mongoose = require('mongoose');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createClassesQuery = require('../queries/create');
const Classes = require('../Model');
const escapeRegExp = require('../../utils/escapeRegExp');
const getNextClassCodeQuery = require('../queries/getNextClassesCodeQuery');
const addClassesToTeacherAccountQuery = require('../queries/addClassesToTeacherAccount');

module.exports = async function classesCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');
  // const teacherAccountId = get(req, 'user.teacherAccount');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const description = get(req, 'body.description');
  const date = get(req, 'body.date');
  const duration = get(req, 'body.duration');
  const focus = get(req, 'body.focus');
  const style = get(req, 'body.style');
  const classType = get(req, 'body.classType');
  const teacherAccountId = get(req, 'body.teacherAccountId');
  const code = await getNextClassCodeQuery(teacherAccountId);

  const isClassesExist = await Classes.count({ name: { $eq: escapeRegExp(name) } });

  if (isClassesExist) {
    return res.status(400).json(message.fail('Class exist'));
  }

  const createClassesQueryResult = await createClassesQuery({
    _id,
    code,
    name,
    focus,
    style,
    classType,
    description,
    date,
    duration,
    teacherAccount: teacherAccountId,
    owner: userId,
  });

  const addClassesToTeacherAccountResult = await addClassesToTeacherAccountQuery({
    classesId: _id,
    teacherAccountId,
  });

  console.log(addClassesToTeacherAccountResult, createClassesQueryResult);

  if (createClassesQueryResult.success && addClassesToTeacherAccountResult.success) {
    res.status(200).json(createClassesQueryResult);
  } else {
    const analyticsId = analytics('CLASSES_CREATE_ERROR', {
      error: createClassesQueryResult.payload,
      body: req.body,
      entity: 'Classes',
      entityId: _id,
      user: userId,
      controller: 'classesCreate',
    });

    res.status(400).json(message.fail('Classes create error', analyticsId));
  }
};
