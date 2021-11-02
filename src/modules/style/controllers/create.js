const mongoose = require('mongoose');
const Style = require('../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createStyleQuery = require('../queries/create');
const addStyleToTeacherAccountQuery = require('../queries/addStyleToTeacherAccount');
const escapeRegExp = require('../../utils/escapeRegExp');

module.exports = async function styleCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const teacherAccountId = get(req, 'body.teacherAccountId');
  const description = get(req, 'body.description');

  const isStyleExist = await Style.count({ name: { $eq: escapeRegExp(name) } });

  if (isStyleExist) {
    return res.status(400).json(message.fail('Style exist'));
  }

  const createStyleQueryResult = await createStyleQuery({
    _id,
    name,
    description,
    owner: userId,
  });

  const addStyleToTeacherAccountResult = await addStyleToTeacherAccountQuery({
    styleId: _id,
    teacherAccountId,
  });

  console.log(addStyleToTeacherAccountResult, createStyleQueryResult);

  if (createStyleQueryResult.success && addStyleToTeacherAccountResult) {
    res.status(200).json(createStyleQueryResult);
  } else {
    const analyticsId = analytics('STYLE_CREATE_ERROR', {
      error: createStyleQueryResult.payload,
      body: req.body,
      entity: 'Style',
      entityId: _id,
      user: userId,
      controller: 'styleCreate',
    });

    res.status(400).json(message.fail('Style create error', analyticsId));
  }
};
