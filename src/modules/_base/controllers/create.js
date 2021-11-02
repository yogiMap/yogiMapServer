const mongoose = require('mongoose');
//const Base = require ( '../Model');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createBaseQuery = require('../queries/create');

module.exports = async function baseCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const description = get(req, 'body.description');

  const createBaseQueryResult = await createBaseQuery({
    _id,
    name,
    description,
    owner: userId,
  });

  if (createBaseQueryResult.success) {
    res.status(200).json(createBaseQueryResult);
  } else {
    const analyticsId = analytics('BASE_CREATE_ERROR', {
      error: createBaseQueryResult.payload,
      body: req.body,
      entity: 'Base',
      entityId: _id,
      user: userId,
      controller: 'baseCreate',
    });

    res.status(400).json(message.fail('Base create error', analyticsId));
  }
};
