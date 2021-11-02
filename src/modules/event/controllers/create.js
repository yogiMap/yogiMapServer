const mongoose = require('mongoose');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createEventQuery = require('../queries/create');
const Event = require('../Model');
const escapeRegExp = require('../../utils/escapeRegExp');
const addEventToTeacherAccountQuery = require('../queries/addEventToTeacherAccount');
const getNextEventCodeQuery = require('../queries/getNextEventCodeQuery');

module.exports = async function eventCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'user._id');
  // const teacherAccountId = get(req, 'user.teacherAccount');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const description = get(req, 'body.description');
  const date = get(req, 'body.date');
  const focus = get(req, 'body.focus');
  const style = get(req, 'body.style');
  const classType = get(req, 'body.classType');
  const duration = get(req, 'body.duration');
  const teacherAccountId = get(req, 'body.teacherAccountId');
  const code = await getNextEventCodeQuery(teacherAccountId);

  const isEventExist = await Event.count({ name: { $eq: escapeRegExp(name) } });

  if (isEventExist) {
    return res.status(400).json(message.fail('Event exist'));
  }

  const createEventQueryResult = await createEventQuery({
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

  const addEventToTeacherAccountResult = await addEventToTeacherAccountQuery({
    eventId: _id,
    teacherAccountId,
  });

  console.log(addEventToTeacherAccountResult, createEventQueryResult);

  if (createEventQueryResult.success && addEventToTeacherAccountResult) {
    res.status(200).json(createEventQueryResult);
  } else {
    const analyticsId = analytics('EVENT_CREATE_ERROR', {
      error: createEventQueryResult.payload,
      body: req.body,
      entity: 'Event',
      entityId: _id,
      user: userId,
      controller: 'eventCreate',
    });

    res.status(400).json(message.fail('Event create error', analyticsId));
  }
};
